import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident.dto';
import { IsEnum } from 'class-validator';
import { IncidentStatus } from '../entities/incident.entity';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {}
export class UpdateIncidentStatusDto {
  @ApiProperty({
    example: 'resolved',
    description: 'Status of the incident',
  })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;
}
