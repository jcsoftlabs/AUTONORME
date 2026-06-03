import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PartsService } from './parts.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { PartCategory, Role } from '@autonorme/types';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@ApiTags('parts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Catalogue pièces AUTOparts (public)' })
  @ApiQuery({ name: 'category', enum: PartCategory, required: false })
  @ApiQuery({ name: 'make', required: false, type: String })
  @ApiQuery({ name: 'model', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @Query('category') category?: PartCategory,
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('year') year?: number,
    @Query('q') q?: string,
    @Query('page') page?: number,
  ) {
    return this.partsService.findAll({
      category,
      make,
      model,
      year: year ? Number(year) : undefined,
      q,
      page: page ? Number(page) : 1,
    });
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Lister toutes les pièces (Admin)' })
  @ApiQuery({ name: 'category', enum: PartCategory, required: false })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllAdmin(
    @Query('category') category?: PartCategory,
    @Query('q') q?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.partsService.findAllAdmin({
      category,
      q,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/suppliers')
  @ApiOperation({ summary: 'Lister les fournisseurs pour formulaire pièce (Admin)' })
  findSuppliersForAdmin() {
    return this.partsService.findSuppliersForAdmin();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Créer une pièce AUTOparts (Admin)' })
  create(@Body() dto: CreatePartDto) {
    return this.partsService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une pièce AUTOparts (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePartDto) {
    return this.partsService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activer/Désactiver une pièce AUTOparts (Admin)' })
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.partsService.toggleActive(id, isActive);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une pièce AUTOparts (Admin, suppression logique)' })
  remove(@Param('id') id: string) {
    return this.partsService.remove(id);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une pièce (public)' })
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(id);
  }

  @Get(':id/check-compatibility')
  @ApiOperation({ summary: 'Vérifier compatibilité pièce/véhicule (T-01)' })
  @ApiQuery({ name: 'make', required: true })
  @ApiQuery({ name: 'model', required: true })
  @ApiQuery({ name: 'year', required: true, type: Number })
  checkCompatibility(
    @Param('id') id: string,
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('year') year: number,
  ) {
    return this.partsService.checkCompatibility(id, make, model, Number(year));
  }
}
