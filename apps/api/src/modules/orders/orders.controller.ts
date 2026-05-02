import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Mes commandes' })
  findAll(@CurrentUser() user: User) { return this.ordersService.findAll(user.id); }

  @Get(':id')
  @ApiOperation({ summary: 'Détail commande' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) { return this.ordersService.findOne(id, user.id); }

  @Post()
  @ApiOperation({ summary: 'Passer une commande AUTOparts' })
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) { return this.ordersService.create(user.id, dto); }
}
