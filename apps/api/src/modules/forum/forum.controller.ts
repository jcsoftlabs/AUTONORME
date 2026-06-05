import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { Public } from '../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ForumThreadCategory } from '@prisma/client';

@ApiTags('forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Public()
  @Get('threads')
  @ApiOperation({ summary: 'Lister les sujets du forum' })
  listThreads(@Query('category') category?: ForumThreadCategory) {
    return this.forumService.listThreads(category);
  }

  @Public()
  @Get('threads/:slug')
  @ApiOperation({ summary: 'Lire un sujet avec ses réponses' })
  getThread(@Param('slug') slug: string) {
    return this.forumService.getThread(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('threads')
  @ApiOperation({ summary: 'Créer un nouveau sujet' })
  createThread(
    @CurrentUser() user: { id: string },
    @Body() body: { title: string; body: string; category: ForumThreadCategory },
  ) {
    return this.forumService.createThread(user.id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/replies')
  @ApiOperation({ summary: 'Répondre à un sujet' })
  reply(
    @CurrentUser() user: { id: string },
    @Param('id') threadId: string,
    @Body('body') body: string,
  ) {
    return this.forumService.reply(user.id, threadId, body);
  }
}
