import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AutobotService } from './autobot.service';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import type { User } from '@prisma/client';

@ApiTags('autobot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('autobot')
export class AutobotController {
  constructor(private readonly autobotService: AutobotService) {}

  // Route publique — AutoBot accessible sans compte (BLOC 4)
  @Public()
  @Post('chat')
  @ApiOperation({ summary: 'Chat avec AutoBot (public ou authentifié)' })
  async chat(
    @Body() dto: ChatDto,
    @CurrentUser() user?: User,
  ) {
    const userId = user?.id ?? 'anonymous';
    const channel = 'WEB';
    const reply = await this.autobotService.chat(userId, channel, dto.message, dto.history ?? []);
    return { reply };
  }
}
