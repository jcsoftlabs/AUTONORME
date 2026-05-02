import {
  IsString, IsInt, IsOptional, IsEnum, Min, Max, Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  make!: string;

  @ApiProperty({ example: 'RAV4' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 2018 })
  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @ApiProperty({ enum: ['essence', 'diesel', 'hybride'] })
  @IsEnum(['essence', 'diesel', 'hybride'])
  fuelType!: string;

  @ApiPropertyOptional({ example: 'JTMRFREV2JJ221452' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/i, { message: 'VIN invalide (17 caractères)' })
  vin?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsInt()
  @IsOptional()
  mileage?: number;

  @ApiPropertyOptional({ example: 'Gris' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'AA-1234-HT' })
  @IsString()
  @IsOptional()
  plate?: string;
}
