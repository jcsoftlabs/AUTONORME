import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendTemplateDto {
  @ApiProperty({ example: '+50912345678' }) @IsString() phone: string;
  @ApiProperty({ example: 'appointment_confirmed' }) @IsString() templateName: string;
  @ApiProperty() parameters: Record<string, string>;
}
