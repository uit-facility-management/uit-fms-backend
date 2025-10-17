import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsString } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty({ example: 'Tòa B', description: 'Name of the building' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'active', description: 'Status of the building' })
  @IsString()
  status: string;
}
