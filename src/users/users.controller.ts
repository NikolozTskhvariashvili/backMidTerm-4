import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamDro } from './dto/query-param.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('total-users')
  getAllUsersLength() {
    return this.usersService.getAllUsersLength();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryParamsDto: QueryParamDro) {
    const page = queryParamsDto.page ? queryParamsDto.page : 1;
    const take = queryParamsDto.take ? queryParamsDto.take : 30;

    return this.usersService.findAll(page,take,queryParamsDto);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.usersService.remove(id);
  }
}
