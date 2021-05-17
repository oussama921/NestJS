import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CoverPasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly newPassword: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly code: string;
}
