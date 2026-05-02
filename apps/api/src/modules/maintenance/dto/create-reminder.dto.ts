import { IsString, IsDateString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty() @IsUUID() vehicleId: string;
  @ApiProperty({ example: 'Vidange huile' }) @IsString() type: string;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}
