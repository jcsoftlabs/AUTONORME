import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PartsService } from './parts.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { PartCategory } from '@autonorme/types';

@ApiTags('parts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Catalogue pièces AUTOparts (public)' })
  @ApiQuery({ name: 'category', enum: PartCategory, required: false })
  @ApiQuery({ name: 'make', required: false, type: String })
  @ApiQuery({ name: 'model', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @Query('category') category?: PartCategory,
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('page') page?: number,
  ) {
    return this.partsService.findAll({ category, make, model, page: page ? Number(page) : 1 });
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
