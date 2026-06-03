import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartCategory, PartCondition } from '@autonorme/types';

export class CompatibleVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({ example: [2018, 2019, 2020] })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  years!: number[];
}

export class CreatePartDto {
  @ApiProperty({ example: 'Plaquettes de frein avant' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Brembo' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PartCategory })
  @IsEnum(PartCategory)
  category!: PartCategory;

  @ApiPropertyOptional({ enum: PartCondition, default: PartCondition.NEW })
  @IsEnum(PartCondition)
  @IsOptional()
  condition?: PartCondition;

  @ApiPropertyOptional({ example: 'BRK-COR-2020-FR' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: 'Garantie 90 jours' })
  @IsString()
  @IsOptional()
  warrantyInfo?: string;

  @ApiProperty()
  @IsUUID()
  supplierId!: string;

  @ApiProperty({ type: [CompatibleVehicleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompatibleVehicleDto)
  compatibleVehicles!: CompatibleVehicleDto[];

  @ApiPropertyOptional({ example: '04465-02410' })
  @IsString()
  @IsOptional()
  oemReference?: string;

  @ApiProperty({ example: 4500 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceHtg!: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stockQty!: number;

  @ApiProperty({ example: 'Entrepôt Delmas 33' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  importAvailable?: boolean;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  importDelayDays?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
