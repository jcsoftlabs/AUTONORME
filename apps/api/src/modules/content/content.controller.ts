import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '@autonorme/types';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('featured-models')
  async getFeaturedModels() {
    return this.contentService.getFeaturedModels();
  }

  @Post('featured-models')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async create(@Body() data: any) {
    return this.contentService.createFeaturedModel(data);
  }

  @Patch('featured-models/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateFeaturedModel(id, data);
  }

  @Delete('featured-models/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.contentService.deleteFeaturedModel(id);
  }
}
