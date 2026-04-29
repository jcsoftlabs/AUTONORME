import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'uuid-du-vehicule' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: 'uuid-du-garage' })
  @IsUUID()
  garageId: string;

  @ApiProperty({ example: '2026-05-10T09:00:00.000Z' })
  @IsDateString()
  datetime: string;

  @ApiPropertyOptional({ example: 'Bruit suspect au freinage arrière' })
  @IsString()
  @IsOptional()
  notes?: string;
}
