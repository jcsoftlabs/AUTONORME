import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ErrorCodes } from '@autonorme/types';
import type { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string): Promise<Appointment[]> {
    return this.db.appointment.findMany({
      where: { userId },
      include: { garage: true, vehicle: true },
      orderBy: { datetime: 'desc' },
    });
  }

  async create(userId: string, dto: CreateAppointmentDto): Promise<Appointment> {
    return this.db.appointment.create({
      data: {
        userId,
        vehicleId: dto.vehicleId,
        garageId: dto.garageId,
        datetime: new Date(dto.datetime),
        notes: dto.notes,
        status: 'PENDING',
      },
      include: { garage: true, vehicle: true },
    });
  }

  async cancel(id: string, userId: string): Promise<Appointment> {
    const appt = await this.db.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException({ code: ErrorCodes.APPOINTMENT_NOT_FOUND, message: 'RDV introuvable' });
    if (appt.userId !== userId) throw new ForbiddenException();
    if (appt.status === 'COMPLETED') {
      throw new BadRequestException({ code: ErrorCodes.APPOINTMENT_CANNOT_CANCEL, message: 'Impossible d\'annuler un RDV terminé' });
    }
    return this.db.appointment.update({ where: { id }, data: { status: 'CANCELLED' } });
  }
}
