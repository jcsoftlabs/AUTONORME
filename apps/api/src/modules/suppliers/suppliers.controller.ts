import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Role } from '@autonorme/types';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Lister les fournisseurs (Admin)' })
  findAllAdmin() {
    return this.suppliersService.findAllAdmin();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Créer un fournisseur + compte (Admin)' })
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/verify')
  @ApiOperation({ summary: 'Vérifier/Dé-vérifier un fournisseur (Admin)' })
  verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    return this.suppliersService.verify(id, isVerified);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activer/Désactiver un fournisseur (Admin)' })
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.suppliersService.toggleActive(id, isActive);
  }
}
