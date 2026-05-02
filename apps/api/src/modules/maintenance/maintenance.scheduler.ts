import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MaintenanceService } from './maintenance.service';

@Injectable()
export class MaintenanceScheduler {
  private readonly logger = new Logger(MaintenanceScheduler.name);

  constructor(private readonly maintenanceService: MaintenanceService) {}

  // Tous les jours à 8h00 heure Haïti (UTC-4 → 12:00 UTC)
  @Cron('0 12 * * *', { timeZone: 'America/Port-au-Prince' })
  async handleDailyReminders(): Promise<void> {
    this.logger.log('Traitement des rappels de maintenance J-7/J-1...');
    const count = await this.maintenanceService.processUpcomingReminders();
    this.logger.log(`${count} rappels envoyés`);
  }
}
