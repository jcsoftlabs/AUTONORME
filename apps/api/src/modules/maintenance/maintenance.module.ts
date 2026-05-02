import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceScheduler } from './maintenance.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceScheduler],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
