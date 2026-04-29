import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.db.user.update({ where: { id }, data: dto });
  }
}
