import { Module } from '@nestjs/common';
import { AutobotService } from './autobot.service';
import { AutobotController } from './autobot.controller';

@Module({
  controllers: [AutobotController],
  providers: [AutobotService],
  exports: [AutobotService],
})
export class AutobotModule {}
