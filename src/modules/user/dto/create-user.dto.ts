import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from 'modules/rbac/user-role.enum';

export class CreateUserDTO {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly role: UserRoleEnum;

  // @ApiProperty()
  // readonly teamId: number;

  password:string;
}
