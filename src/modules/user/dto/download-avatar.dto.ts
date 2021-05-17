import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DownloadAvatarDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly avatar: string;

}
