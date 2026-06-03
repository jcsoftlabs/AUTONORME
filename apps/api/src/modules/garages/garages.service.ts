import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { Garage } from '@prisma/client';
import { ErrorCodes, Role } from '@autonorme/types';
import { CreateGarageDto } from './dto/create-garage.dto';
import slugify from 'slugify';

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
    if (!garage) {
      throw new NotFoundException({ code: ErrorCodes.GARAGE_NOT_FOUND, message: 'Garage introuvable' });
    }
    return garage;
  }

  // Admin Methods
  async findAllAdmin(): Promise<Garage[]> {
    return this.db.garage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async verify(id: string, isVerified: boolean): Promise<Garage> {
    return this.db.garage.update({
      where: { id },
      data: { isVerified },
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Garage> {
    return this.db.garage.update({
      where: { id },
      data: { isActive },
    });
  }

  async create(dto: CreateGarageDto): Promise<Garage> {
    const slug = slugify(dto.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substr(2, 5);
    const owner = dto.ownerEmail
      ? await this.db.user.upsert({
          where: { email: dto.ownerEmail },
          update: {
            name: dto.ownerName ?? dto.name,
            role: Role.GARAGE,
            isActive: true,
            phone: null,
          },
          create: {
            email: dto.ownerEmail,
            name: dto.ownerName ?? dto.name,
            role: Role.GARAGE,
            isActive: true,
          },
        })
      : null;
    
    return this.db.garage.create({
      data: {
        name: dto.name,
        address: dto.address,
        city: dto.city,
        lat: dto.lat,
        lng: dto.lng,
        phone: dto.phone,
        description: dto.description,
        specialties: dto.specialties ?? [],
        imageUrl: dto.imageUrl,
        slug,
        ownerId: owner?.id,
        isActive: true,
        isVerified: true, // Admin-created garages are verified by default
      },
    });
  }
}
