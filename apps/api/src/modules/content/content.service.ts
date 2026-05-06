import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ContentService {
  constructor(private prisma: DatabaseService) {}

  async getFeaturedModels() {
    return this.prisma.featuredModel.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }
}
