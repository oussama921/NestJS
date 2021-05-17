import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateObjectDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id: number
  
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
