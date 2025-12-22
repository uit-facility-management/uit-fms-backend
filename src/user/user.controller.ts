import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserDto,
  SignInDto,
  UpdatePasswordDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id/schedules')
  @ApiOperation({
    summary: 'Get schedules for a user',
    description: 'Retrieve all schedules created by a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({ description: 'Schedules retrieved successfully' })
  findSchedules(@Param('id') id: string) {
    return this.userService.findSchedules(id);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id/change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change the password of a user by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: 'User password changed successfully' })
  changePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.changePassword(id, updatePasswordDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update user information with partial fields',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
