import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ChatMessage } from '../autobot.service';

export class ChatDto {
  @ApiProperty({ example: 'Je cherche des plaquettes de frein pour mon RAV4 2018' })
  @IsString()
  message!: string;

  @ApiPropertyOptional({ type: Array })
  @IsArray()
  @IsOptional()
  history?: ChatMessage[];
}
