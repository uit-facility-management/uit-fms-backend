import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The incident has been created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentService.create(createIncidentDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of incidents.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findAll() {
    return this.incidentService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The incident details.' })
  @ApiResponse({ status: 404, description: 'Incident not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.incidentService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'The incident has been updated.' })
  @ApiResponse({ status: 404, description: 'Incident not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    return this.incidentService.update(id, updateIncidentDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The incident has been deleted.' })
  @ApiResponse({ status: 404, description: 'Incident not found.' })
  remove(@Param('id') id: string) {
    return this.incidentService.remove(id);
  }
}
