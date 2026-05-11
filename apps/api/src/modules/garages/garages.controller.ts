import { Controller, Get, Param, Query, UseGuards, Patch, Body, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GaragesService } from './garages.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Role } from '@autonorme/types';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CreateGarageDto } from './dto/create-garage.dto';

@ApiTags('garages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('garages')
export class GaragesController {
  constructor(private readonly garagesService: GaragesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les garages (public)' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('specialty') specialty?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.garagesService.findAll({ specialty, page, limit });
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Fiche détaillée d\'un garage (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.garagesService.findBySlug(slug);
  }

  // Admin Routes
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Lister tous les garages (Admin)' })
  findAllAdmin() {
    return this.garagesService.findAllAdmin();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/verify')
  @ApiOperation({ summary: 'Vérifier/Dé-vérifier un garage (Admin)' })
  verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    return this.garagesService.verify(id, isVerified);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau garage (Admin)' })
  create(@Body() dto: CreateGarageDto) {
    return this.garagesService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activer/Désactiver un garage (Admin)' })
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.garagesService.toggleActive(id, isActive);
  }
}
