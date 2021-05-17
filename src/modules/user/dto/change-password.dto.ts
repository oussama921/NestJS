import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()

  readonly oldPassword: string

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()

  readonly newPassword: string


}
