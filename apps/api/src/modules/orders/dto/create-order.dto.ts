import { IsEnum, IsArray, IsString, IsUUID, IsOptional, ArrayMinSize, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, DeliveryType } from '@autonorme/types';

export class OrderItemDto {
  @IsUUID() partId!: string;
  @IsString() supplierId!: string;
  @IsInt() qty!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray() @ArrayMinSize(1) items!: OrderItemDto[];

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod) paymentMethod!: PaymentMethod;

  @ApiProperty({ enum: DeliveryType })
  @IsEnum(DeliveryType) deliveryType!: DeliveryType;

  @ApiPropertyOptional() @IsString() @IsOptional() deliveryAddress?: string;
}
