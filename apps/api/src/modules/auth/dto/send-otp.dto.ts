import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+50912345678', description: 'Numéro haïtien +509XXXXXXXX' })
  @IsString()
  @Matches(/^\+509\d{8}$/, { message: 'Format requis : +509XXXXXXXX' })
  phone: string;
}
