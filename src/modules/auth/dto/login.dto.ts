import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()

  readonly password: string;

}
