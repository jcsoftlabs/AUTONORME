import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly apptService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Mes rendez-vous' })
  findAll(@CurrentUser() user: User) {
    return this.apptService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Prendre un rendez-vous' })
  create(@CurrentUser() user: User, @Body() dto: CreateAppointmentDto) {
    return this.apptService.create(user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler un rendez-vous' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.apptService.cancel(id, user.id);
  }
}
