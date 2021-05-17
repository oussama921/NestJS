import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { UserRoleEnum } from 'modules/rbac/user-role.enum';

export class SignUpDTO {

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly firstName: string

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber(null, null)
  readonly phone: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    readonly acceptCGU: boolean;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    readonly role: UserRoleEnum;

}
