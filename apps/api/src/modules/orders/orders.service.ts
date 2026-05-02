import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ErrorCodes } from '@autonorme/types';
import type { Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string) {
    return this.db.order.findMany({
      where: { userId },
      include: { items: { include: { part: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.db.order.findUnique({
      where: { id },
      include: { items: { include: { part: true, supplier: true } }, invoice: true },
    });
    if (!order) throw new NotFoundException({ code: ErrorCodes.ORDER_NOT_FOUND, message: 'Commande introuvable' });
    if (order.userId !== userId) throw new BadRequestException();
    return order;
  }

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    // Valider stock et calculer total
    let totalHtg = new Decimal(0);
    const enrichedItems: Array<{ partId: string; supplierId: string; qty: number; priceHtg: Decimal }> = [];

    for (const item of dto.items) {
      const part = await this.db.part.findUnique({ where: { id: item.partId } });
      if (!part || !part.isActive) {
        throw new BadRequestException({ code: ErrorCodes.PART_NOT_FOUND, message: `Pièce ${item.partId} introuvable` });
      }
      if (part.stockQty < item.qty) {
        // Import possible si importAvailable
        if (!part.importAvailable) {
          throw new BadRequestException({
            code: ErrorCodes.PART_OUT_OF_STOCK,
            message: `Stock insuffisant pour ${part.name}`,
          });
        }
      }
      totalHtg = totalHtg.add(part.priceHtg.mul(item.qty));
      enrichedItems.push({ partId: item.partId, supplierId: item.supplierId, qty: item.qty, priceHtg: part.priceHtg });
    }

    const order = await this.db.order.create({
      data: {
        userId,
        totalHtg,
        status: 'CONFIRMED',
        paymentMethod: dto.paymentMethod,
        deliveryType: dto.deliveryType,
        deliveryAddress: dto.deliveryAddress,
        items: { create: enrichedItems },
      },
      include: { items: { include: { part: true } } },
    });

    // Générer numéro de facture
    const invoiceNumber = `AUT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
    await this.db.invoice.create({
      data: { orderId: order.id, number: invoiceNumber, totalHtg },
    });

    return order;
  }

  async updateStatus(id: string, status: string) {
    return this.db.order.update({ where: { id }, data: { status: status as any } });
  }
}
