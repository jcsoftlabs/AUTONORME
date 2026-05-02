import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import type { MaintenanceReminder } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string) {
    return this.db.maintenanceRecord.findMany({
      where: { vehicle: { userId } },
      include: { vehicle: true },
      orderBy: { date: 'desc' },
    });
  }

  async findReminders(userId: string): Promise<MaintenanceReminder[]> {
    return this.db.maintenanceReminder.findMany({
      where: { vehicle: { userId }, status: { not: 'DONE' } },
      include: { vehicle: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createReminder(_userId: string, dto: CreateReminderDto): Promise<MaintenanceReminder> {
    return this.db.maintenanceReminder.create({
      data: {
        vehicleId: dto.vehicleId,
        type: dto.type,
        dueDate: new Date(dto.dueDate),
        status: 'PENDING',
      },
    });
  }

  async updateReminderStatus(id: string, status: string): Promise<MaintenanceReminder> {
    return this.db.maintenanceReminder.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // Appelé par le job BullMQ — envoie rappels pour les RDV J-7 et J-1
  async processUpcomingReminders(): Promise<number> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const reminders = await this.db.maintenanceReminder.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lte: nextWeek },
        notifiedAt: null,
      },
      include: { vehicle: { include: { user: true } } },
    });

    for (const reminder of reminders) {
      try {
        await this.db.notification.create({
          data: {
            userId: reminder.vehicle.userId,
            type: 'MAINTENANCE_REMINDER',
            title: `Rappel : ${reminder.type}`,
            body: `Votre ${reminder.vehicle.make} ${reminder.vehicle.model} nécessite un(e) ${reminder.type} avant le ${reminder.dueDate.toLocaleDateString('fr-HT')}.`,
            data: { reminderId: reminder.id, vehicleId: reminder.vehicleId },
          },
        });

        await this.db.maintenanceReminder.update({
          where: { id: reminder.id },
          data: { notifiedAt: new Date(), status: 'SENT' },
        });
      } catch (err) {
        this.logger.error(`Échec rappel ${reminder.id}`, err);
      }
    }

    this.logger.log(`${reminders.length} rappels traités`);
    return reminders.length;
  }
}
