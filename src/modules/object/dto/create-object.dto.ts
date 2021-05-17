import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from 'modules/rbac/user-role.enum';

export class CreateObjectDTO {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly item: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly quantity: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly place: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  code :string;
}
