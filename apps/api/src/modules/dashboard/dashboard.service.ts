import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AccountStatus, JoinRequestStatus, Role } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getSummary() {
    const [
      totalUsers,
      activeGarages,
      pendingGarages,
      pendingSuppliers,
      pendingJoinRequests,
      totalOrders,
      recentGarages,
      recentSuppliers,
      recentOrders,
    ] = await Promise.all([
      this.db.user.count(),
      this.db.garage.count({ where: { isActive: true, isVerified: true } }),
      this.db.garage.count({ where: { isVerified: false } }),
      this.db.supplier.count({ where: { isVerified: false } }),
      this.db.joinRequest.count({ where: { status: JoinRequestStatus.PENDING } }),
      this.db.order.count(),
      this.db.garage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, city: true, isVerified: true, isActive: true, createdAt: true },
      }),
      this.db.supplier.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, shopName: true, city: true, isVerified: true, isActive: true, createdAt: true },
      }),
      this.db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, status: true, totalHtg: true, createdAt: true, user: { select: { name: true } } },
      }),
    ]);

    const pendingValidations = pendingGarages + pendingSuppliers + pendingJoinRequests;

    const adminUsers = await this.db.user.count({
      where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
    });

    const pendingAccounts = await this.db.user.count({
      where: { accountStatus: AccountStatus.PENDING, role: { in: [Role.GARAGE, Role.SUPPLIER] } },
    });

    return {
      totals: {
        totalUsers,
        activeGarages,
        pendingValidations: pendingValidations + pendingAccounts,
        totalOrders,
        adminUsers,
      },
      recent: {
        garages: recentGarages,
        suppliers: recentSuppliers,
        orders: recentOrders,
      },
    };
  }
}
