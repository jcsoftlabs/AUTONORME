import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ErrorCodes, PartCategory } from '@autonorme/types';
import type { Part } from '@prisma/client';

export interface PartSearchParams {
  make?: string;
  model?: string;
  year?: number;
  category?: PartCategory;
  page?: number;
  limit?: number;
}

interface CompatibleVehicle {
  make: string;
  model: string;
  years: number[];
}

@Injectable()
export class PartsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: PartSearchParams): Promise<Part[]> {
    const { make, model, year, category, page = 1, limit = 20 } = params;

    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    // Filtrage dynamique par compatibilité véhicule (JSONB PostgreSQL)
    if (make || model || year) {
      const allActiveParts = await this.db.part.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
        },
        select: { id: true, compatibleVehicles: true },
      });

      const compatiblePartIds = allActiveParts
        .filter((part) =>
          this.matchesCompatibleVehicle(
            part.compatibleVehicles as unknown as CompatibleVehicle[] | null,
            make,
            model,
            year,
          ),
        )
        .map((part) => part.id);

      if (compatiblePartIds.length === 0) {
        return [];
      }

      where.id = { in: compatiblePartIds };
    }

    return this.db.part.findMany({
      where,
      include: { supplier: { select: { shopName: true, city: true } } },
      orderBy: { stockQty: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.db.part.findUnique({
      where: { id },
      include: { supplier: { select: { shopName: true, city: true, zones: true } } },
    });
    if (!part || !part.isActive) {
      throw new NotFoundException({ code: ErrorCodes.PART_NOT_FOUND, message: 'Pièce introuvable' });
    }
    return part;
  }

  // Vérification compatibilité (T-01 du BLOC 12 — critique)
  async checkCompatibility(partId: string, make: string, model: string, year: number): Promise<{ compatible: boolean; alternatives?: Part[] }> {
    const part = await this.findOne(partId);
    const compatible = this.matchesCompatibleVehicle(
      part.compatibleVehicles as unknown as CompatibleVehicle[] | null,
      make,
      model,
      year,
    );

    if (!compatible) {
      // Chercher des alternatives compatibles
      const alternatives = await this.db.part.findMany({
        where: {
          isActive: true,
          category: part.category,
          id: { not: partId },
        },
        take: 3,
      });

      throw new BadRequestException({
        code: ErrorCodes.PART_INCOMPATIBLE,
        message: `Cette pièce n'est pas compatible avec ${make} ${model} ${year}.`,
        details: { alternatives },
      });
    }

    return { compatible: true };
  }

  private matchesCompatibleVehicle(
    vehicles: CompatibleVehicle[] | null | undefined,
    make?: string,
    model?: string,
    year?: number,
  ): boolean {
    if (!vehicles?.length) return false;

    return vehicles.some((vehicle) => {
      const makeMatch = make
        ? vehicle.make.toLowerCase() === make.toLowerCase()
        : true;
      const modelMatch = model
        ? vehicle.model.toLowerCase() === model.toLowerCase()
        : true;
      const yearMatch = year
        ? Array.isArray(vehicle.years) && vehicle.years.includes(year)
        : true;

      return makeMatch && modelMatch && yearMatch;
    });
  }
}
