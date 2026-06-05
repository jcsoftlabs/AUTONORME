import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinRequestsService } from './join-requests.service';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JoinRequestStatus } from '@prisma/client';
import { Role } from '@autonorme/types';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';

@ApiTags('join-requests')
@Controller('join-requests')
export class JoinRequestsController {
  constructor(private readonly joinRequestsService: JoinRequestsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Créer une demande de rejoindre le réseau' })
  create(@Body() body: { type: string; companyName: string; contactName: string; email: string; phone?: string; city?: string; message?: string; locale?: string }) {
    return this.joinRequestsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Lister les demandes de partenariat' })
  list() {
    return this.joinRequestsService.list();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour le statut d’une demande' })
  update(
    @Param('id') id: string,
    @Body() body: { status: JoinRequestStatus; adminNote?: string | null },
  ) {
    return this.joinRequestsService.updateStatus(id, body.status, body.adminNote);
  }
}
