import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { Garage } from '@prisma/client';
import { ErrorCodes } from '@autonorme/types';

export interface GarageSearchParams {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  specialty?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class GaragesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: GarageSearchParams): Promise<Garage[]> {
    const { specialty, page = 1, limit = 20 } = params;

    return this.db.garage.findMany({
      where: {
        isActive: true,
        ...(specialty ? { specialties: { has: specialty } } : {}),
      },
      orderBy: [{ isVerified: 'desc' }, { rating: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findBySlug(slug: string): Promise<Garage> {
    const garage = await this.db.garage.findUnique({ where: { slug } });
    if (!garage || !garage.isActive) {
      throw new NotFoundException({
        code: ErrorCodes.GARAGE_NOT_FOUND,
        message: 'Garage introuvable',
      });
    }
    return garage;
  }

  async findById(id: string): Promise<Garage> {
    const garage = await this.db.garage.findUnique({ where: { id } });
    if (!garage || !garage.isActive) {
      throw new NotFoundException({ code: ErrorCodes.GARAGE_NOT_FOUND, message: 'Garage introuvable' });
    }
    return garage;
  }
}
