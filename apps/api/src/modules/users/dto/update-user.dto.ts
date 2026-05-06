import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jean-Marie Destine' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['fr', 'ht', 'en'], example: 'fr' })
  @IsEnum(['fr', 'ht', 'en'])
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/path/to/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
