import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateUsereDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id: number
  
  @ApiProperty()
  readonly firstName: string
  @ApiProperty()
  readonly phone: string
  @ApiProperty()
  readonly lastName: string
  @ApiProperty()
  readonly birthDate: Date;
  @ApiProperty()
  readonly citizenship: string;
  @ApiProperty()
  readonly height: string;
  @ApiProperty()
  readonly shirtSize: string;
  @ApiProperty()
  readonly weight: number;
  @ApiProperty()
  readonly position: string;
  @ApiProperty()
  readonly role: string;
  avatar: string;
}
