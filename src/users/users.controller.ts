import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

export class userLogin {
  email: string;
  password: string;
}
export class refCode {
  referal_code: string;
}

export class updateDto {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getOrder(@Req() req) {
    return this.usersService.findUser(req);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Query() query: refCode) {
    return this.usersService.create(createUserDto, query);
  }

  @Post('login')
  async login(@Body() body: userLogin) {
    return this.usersService.login(body);
  }

  @Patch('forgotpassword')
  async reset(@Body() body: updateDto) {
    return this.usersService.resetPassword(body);
  }

  //auth guard
  @Patch('profile')
  async update(@Body() body: updateDto, @Req() req) {
    return this.usersService.update(body, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(id, req);
  }
}
