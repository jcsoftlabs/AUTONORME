import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ErrorCodes, PartCategory } from '@autonorme/types';
import type { Part, Prisma, Supplier } from '@prisma/client';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

export interface PartSearchParams {
  make?: string;
  model?: string;
  year?: number;
  q?: string;
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

  async findAllAdmin(params: PartSearchParams = {}): Promise<Part[]> {
    const { q, category, page = 1, limit = 50 } = params;
    const query = q?.trim();

    return this.db.part.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { brand: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                { oemReference: { contains: query, mode: 'insensitive' } },
                { supplier: { is: { shopName: { contains: query, mode: 'insensitive' } } } },
              ],
            }
          : {}),
      },
      include: { supplier: { select: { shopName: true, city: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findSuppliersForAdmin(): Promise<Pick<Supplier, 'id' | 'shopName' | 'city' | 'isActive'>[]> {
    return this.db.supplier.findMany({
      select: { id: true, shopName: true, city: true, isActive: true },
      orderBy: { shopName: 'asc' },
    });
  }

  async create(dto: CreatePartDto): Promise<Part> {
    await this.ensureSupplierExists(dto.supplierId);

    return this.db.part.create({
      data: this.toPartData(dto) as Prisma.PartUncheckedCreateInput,
    });
  }

  async update(id: string, dto: UpdatePartDto): Promise<Part> {
    await this.ensurePartExists(id);
    if (dto.supplierId) {
      await this.ensureSupplierExists(dto.supplierId);
    }

    return this.db.part.update({
      where: { id },
      data: this.toPartData(dto) as Prisma.PartUncheckedUpdateInput,
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Part> {
    await this.ensurePartExists(id);

    return this.db.part.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(id: string): Promise<Part> {
    return this.toggleActive(id, false);
  }

  async findAll(params: PartSearchParams): Promise<Part[]> {
    const { make, model, year, q, category, page = 1, limit = 20 } = params;

    const where: any = { isActive: true };
    const query = q?.trim();

    if (category) {
      where.category = category;
    }

    if (query) {
      const normalizedCategory = query
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { oemReference: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { supplier: { is: { shopName: { contains: query, mode: 'insensitive' } } } },
        { supplier: { is: { city: { contains: query, mode: 'insensitive' } } } },
        ...(Object.values(PartCategory).includes(normalizedCategory as PartCategory)
          ? [{ category: normalizedCategory as PartCategory }]
          : []),
      ];
    }

    // Filtrage dynamique par compatibilité véhicule (JSONB PostgreSQL)
    if (make || model || year) {
      const allActiveParts = await this.db.part.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
          ...(where.OR ? { OR: where.OR } : {}),
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

  private async ensureSupplierExists(supplierId: string): Promise<void> {
    const supplier = await this.db.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) {
      throw new BadRequestException({ message: 'Fournisseur introuvable' });
    }
  }

  private async ensurePartExists(id: string): Promise<void> {
    const part = await this.db.part.findUnique({ where: { id } });
    if (!part) {
      throw new NotFoundException({ code: ErrorCodes.PART_NOT_FOUND, message: 'Pièce introuvable' });
    }
  }

  private toPartData(dto: CreatePartDto | UpdatePartDto): Prisma.PartUncheckedCreateInput | Prisma.PartUncheckedUpdateInput {
    const data: Prisma.PartUncheckedCreateInput | Prisma.PartUncheckedUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.brand !== undefined) data.brand = dto.brand || null;
    if (dto.description !== undefined) data.description = dto.description || null;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.condition !== undefined) data.condition = dto.condition;
    if (dto.sku !== undefined) data.sku = dto.sku || null;
    if (dto.warrantyInfo !== undefined) data.warrantyInfo = dto.warrantyInfo || null;
    if (dto.supplierId !== undefined) data.supplierId = dto.supplierId;
    if (dto.compatibleVehicles !== undefined) data.compatibleVehicles = dto.compatibleVehicles as unknown as Prisma.InputJsonValue;
    if (dto.oemReference !== undefined) data.oemReference = dto.oemReference || null;
    if (dto.priceHtg !== undefined) data.priceHtg = dto.priceHtg;
    if (dto.stockQty !== undefined) data.stockQty = dto.stockQty;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.importAvailable !== undefined) data.importAvailable = dto.importAvailable;
    if (dto.importDelayDays !== undefined) data.importDelayDays = dto.importDelayDays ?? null;
    if (dto.images !== undefined) data.images = dto.images.filter(Boolean);
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return data;
  }
}
