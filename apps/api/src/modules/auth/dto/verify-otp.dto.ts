import { IsEmail, IsIn, IsOptional, IsString, Matches, Length, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { OtpAuthMode } from './send-otp.dto';

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: '+50912345678' })
  @IsString()
  @IsOptional()
  @Matches(/^\+509\d{8}$/)
  phone?: string;

  @ApiPropertyOptional({ example: 'client@autonormesolutions.com' })
  @ValidateIf((dto: VerifyOtpDto) => !dto.phone || dto.email !== undefined)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456', description: 'Code OTP 6 chiffres' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Le code doit contenir exactement 6 chiffres' })
  code!: string;

  @ApiPropertyOptional({ enum: ['login', 'register'], default: 'login' })
  @IsIn(['login', 'register'])
  @IsOptional()
  mode?: OtpAuthMode;
}
