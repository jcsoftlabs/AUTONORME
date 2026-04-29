import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { Vehicle } from '@prisma/client';
import { ErrorCodes } from '@autonorme/types';

@Injectable()
export class VehiclesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string): Promise<Vehicle[]> {
    return this.db.vehicle.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Vehicle> {
    const vehicle = await this.db.vehicle.findUnique({ where: { id } });
    if (!vehicle || !vehicle.isActive) {
      throw new NotFoundException({ code: ErrorCodes.VEHICLE_NOT_FOUND, message: 'Véhicule introuvable' });
    }
    if (vehicle.userId !== userId) throw new ForbiddenException();
    return vehicle;
  }

  async create(userId: string, dto: CreateVehicleDto): Promise<Vehicle> {
    return this.db.vehicle.create({ data: { ...dto, userId } });
  }

  async update(id: string, userId: string, dto: Partial<CreateVehicleDto>): Promise<Vehicle> {
    await this.findOne(id, userId);
    return this.db.vehicle.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.db.vehicle.update({ where: { id }, data: { isActive: false } });
  }
}
