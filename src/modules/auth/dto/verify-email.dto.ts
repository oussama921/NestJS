import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({
    required: true,
  })
  readonly email: string;
  @ApiProperty({
    required: true,
  })
  readonly password: string;
}
