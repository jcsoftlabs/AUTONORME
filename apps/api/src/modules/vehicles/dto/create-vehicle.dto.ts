import {
  IsString, IsInt, IsOptional, IsEnum, Min, Max, Matches, IsBoolean, IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const FUEL_TYPES = ['essence', 'diesel', 'hybride', 'electrique'] as const;
const VEHICLE_BODY_TYPES = ['SUV', 'SEDAN', 'HATCHBACK', 'PICKUP', 'VAN', 'MOTO', 'TRICYCLE', 'AUTRE'] as const;
const TRANSMISSION_TYPES = ['MANUELLE', 'AUTOMATIQUE', 'CVT', 'AUTRE'] as const;
const DRIVETRAIN_TYPES = ['FWD', 'RWD', 'AWD', 'FOUR_X_FOUR'] as const;
const VEHICLE_USAGE_TYPES = ['PERSONNEL', 'COMMERCIAL', 'MIXTE'] as const;
const OWNERSHIP_TYPES = ['OWNER', 'FLEET', 'LEASE'] as const;

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

  @ApiProperty({ enum: FUEL_TYPES })
  @IsEnum(FUEL_TYPES)
  fuelType!: string;

  @ApiPropertyOptional({ example: 'Limited' })
  @IsString()
  @IsOptional()
  trim?: string;

  @ApiPropertyOptional({ enum: VEHICLE_BODY_TYPES })
  @IsEnum(VEHICLE_BODY_TYPES)
  @IsOptional()
  bodyType?: string;

  @ApiPropertyOptional({ enum: TRANSMISSION_TYPES })
  @IsEnum(TRANSMISSION_TYPES)
  @IsOptional()
  transmission?: string;

  @ApiPropertyOptional({ example: '2.5L essence' })
  @IsString()
  @IsOptional()
  engine?: string;

  @ApiPropertyOptional({ enum: DRIVETRAIN_TYPES })
  @IsEnum(DRIVETRAIN_TYPES)
  @IsOptional()
  drivetrain?: string;

  @ApiPropertyOptional({ example: 'JTMRFREV2JJ221452' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/i, { message: 'VIN invalide (17 caractères)' })
  vin?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsInt()
  @IsOptional()
  mileage?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsInt()
  @IsOptional()
  averageMonthlyMileage?: number;

  @ApiPropertyOptional({ example: 'Gris' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'AA-1234-HT' })
  @IsString()
  @IsOptional()
  plate?: string;

  @ApiPropertyOptional({ enum: VEHICLE_USAGE_TYPES })
  @IsEnum(VEHICLE_USAGE_TYPES)
  @IsOptional()
  usageType?: string;

  @ApiPropertyOptional({ example: 'Port-au-Prince' })
  @IsString()
  @IsOptional()
  primaryCity?: string;

  @ApiPropertyOptional({ example: 'Delmas' })
  @IsString()
  @IsOptional()
  primaryZone?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimaryVehicle?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @ApiPropertyOptional({ example: 32000 })
  @IsInt()
  @IsOptional()
  purchaseMileage?: number;

  @ApiPropertyOptional({ enum: OWNERSHIP_TYPES })
  @IsEnum(OWNERSHIP_TYPES)
  @IsOptional()
  ownershipType?: string;

  @ApiPropertyOptional({ example: '225/65R17' })
  @IsString()
  @IsOptional()
  tireSize?: string;

  @ApiPropertyOptional({ example: '12V 70Ah' })
  @IsString()
  @IsOptional()
  batterySpec?: string;

  @ApiPropertyOptional({ example: '5W-30 synthétique' })
  @IsString()
  @IsOptional()
  oilSpec?: string;

  @ApiPropertyOptional({ example: 'Toyota Super Long Life Coolant' })
  @IsString()
  @IsOptional()
  coolantSpec?: string;

  @ApiPropertyOptional({ example: 'Disques avant ventilés + plaquettes céramique' })
  @IsString()
  @IsOptional()
  brakeSpec?: string;

  @ApiPropertyOptional({ example: 'fr' })
  @IsString()
  @IsOptional()
  locale?: string;
}
