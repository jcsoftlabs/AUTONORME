import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ForumThreadCategory, ForumThreadStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class ForumService {
  constructor(private readonly db: DatabaseService) {}

  async listThreads(category?: ForumThreadCategory) {
    return this.db.forumThread.findMany({
      where: {
        status: ForumThreadStatus.OPEN,
        ...(category ? { category } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { lastActivityAt: 'desc' }],
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
        posts: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
        },
      },
    });
  }

  async getThread(slug: string) {
    const thread = await this.db.forumThread.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
        posts: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Sujet introuvable');
    }

    return thread;
  }

  async createThread(userId: string, data: { title: string; body: string; category: ForumThreadCategory }) {
    const title = data.title.trim();
    const body = data.body.trim();
    if (!title || !body) throw new BadRequestException('Titre et contenu requis');

    const slugBase = slugify(title, { lower: true, strict: true });
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 7)}`;

    return this.db.forumThread.create({
      data: {
        title,
        body,
        slug,
        category: data.category,
        authorId: userId,
        lastActivityAt: new Date(),
      },
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
        posts: {
          include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
        },
      },
    });
  }

  async reply(userId: string, threadId: string, body: string) {
    const content = body.trim();
    if (!content) throw new BadRequestException('Réponse vide');

    const thread = await this.db.forumThread.findUnique({ where: { id: threadId } });
    if (!thread || thread.status !== ForumThreadStatus.OPEN) {
      throw new NotFoundException('Sujet introuvable');
    }

    const post = await this.db.forumPost.create({
      data: {
        threadId,
        authorId: userId,
        body: content,
      },
      include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });

    await this.db.forumThread.update({
      where: { id: threadId },
      data: {
        repliesCount: { increment: 1 },
        lastActivityAt: new Date(),
      },
    });

    return post;
  }
}
