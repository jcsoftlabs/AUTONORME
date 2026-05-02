import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Historique maintenance' })
  findAll(@CurrentUser() user: User) { return this.maintenanceService.findAll(user.id); }

  @Get('reminders')
  @ApiOperation({ summary: 'Rappels actifs' })
  findReminders(@CurrentUser() user: User) { return this.maintenanceService.findReminders(user.id); }

  @Post('reminders')
  @ApiOperation({ summary: 'Créer un rappel' })
  createReminder(@CurrentUser() user: User, @Body() dto: CreateReminderDto) {
    return this.maintenanceService.createReminder(user.id, dto);
  }

  @Patch('reminders/:id/status')
  @ApiOperation({ summary: 'Mettre à jour statut rappel' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.maintenanceService.updateReminderStatus(id, status);
  }
}
