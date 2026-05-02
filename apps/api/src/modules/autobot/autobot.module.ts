import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AutobotService } from './autobot.service';
import { AutobotController } from './autobot.controller';
import { AutobotGateway } from './autobot.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ secret: c.getOrThrow<string>('JWT_ACCESS_SECRET') }),
    }),
  ],
  controllers: [AutobotController],
  providers: [AutobotService, AutobotGateway],
  exports: [AutobotService],
})
export class AutobotModule {}
