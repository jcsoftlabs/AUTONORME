import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string): Promise<Notification[]> {
    return this.db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    return this.db.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string): Promise<{ count: number }> {
    const result = await this.db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { count: result.count };
  }

  async create(userId: string, type: string, title: string, body: string, data?: Record<string, unknown>): Promise<Notification> {
    return this.db.notification.create({ data: { userId, type, title, body, data } });
  }
}
