import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GaragesService } from './garages.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('garages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
}
