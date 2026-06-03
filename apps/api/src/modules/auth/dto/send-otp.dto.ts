import { IsEmail, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiPropertyOptional({ example: '+50912345678', description: 'Numéro haïtien +509XXXXXXXX' })
  @IsString()
  @IsOptional()
  @Matches(/^\+509\d{8}$/, { message: 'Format requis : +509XXXXXXXX' })
  phone?: string;

  @ApiPropertyOptional({ example: 'client@autonormesolutions.com', description: 'Email pour OTP via Resend' })
  @ValidateIf((dto: SendOtpDto) => !dto.phone || dto.email !== undefined)
  @IsEmail()
  email?: string;
}
