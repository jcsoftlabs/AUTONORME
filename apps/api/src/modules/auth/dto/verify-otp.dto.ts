import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+50912345678' })
  @IsString()
  @Matches(/^\+509\d{8}$/)
  phone: string;

  @ApiProperty({ example: '123456', description: 'Code OTP 6 chiffres' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Le code doit contenir exactement 6 chiffres' })
  code: string;
}
