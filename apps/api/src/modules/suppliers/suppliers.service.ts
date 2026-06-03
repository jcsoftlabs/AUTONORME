import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { Supplier } from '@prisma/client';
import { Role } from '@autonorme/types';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { OtpService } from '../auth/otp.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly db: DatabaseService, private readonly otpService: OtpService) {}

  async findAllAdmin(): Promise<Supplier[]> {
    return this.db.supplier.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true, role: true, isActive: true } } },
    });
  }

  async verify(id: string, isVerified: boolean): Promise<Supplier> {
    return this.db.supplier.update({ where: { id }, data: { isVerified } });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Supplier> {
    return this.db.supplier.update({ where: { id }, data: { isActive } });
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const owner = await this.db.user.upsert({
      where: { email: dto.email },
      update: {
        name: dto.ownerName ?? dto.shopName,
        role: Role.SUPPLIER,
        isActive: true,
        accountStatus: 'PENDING',
        phone: dto.phone ?? undefined,
      },
      create: {
        email: dto.email,
        name: dto.ownerName ?? dto.shopName,
        role: Role.SUPPLIER,
        isActive: true,
        accountStatus: 'PENDING',
        phone: dto.phone,
      },
    });

    const existing = await this.db.supplier.findUnique({ where: { userId: owner.id } });
    const supplier = existing
      ? await this.db.supplier.update({
        where: { id: existing.id },
        data: {
          shopName: dto.shopName,
          address: dto.address,
          city: dto.city,
          phone: dto.phone,
          zones: dto.zones ?? [],
          isActive: true,
        },
      })
      : await this.db.supplier.create({
        data: {
          userId: owner.id,
          shopName: dto.shopName,
          address: dto.address,
          city: dto.city,
          phone: dto.phone,
          zones: dto.zones ?? [],
          isVerified: true,
          isActive: true,
        },
      });

    await this.otpService.sendInvitation(owner.email ?? dto.email, { name: dto.shopName, role: 'SUPPLIER' });
    return supplier;
  }

  async findById(id: string): Promise<Supplier> {
    const supplier = await this.db.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Fournisseur introuvable');
    }
    return supplier;
  }
}
