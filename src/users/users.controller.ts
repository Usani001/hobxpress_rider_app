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
import { AuthGuard } from 'src/auth/auth.guard';

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
  old_password?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getOrder(@Req() req) {
    return this.usersService.findUser(req);
  }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Post('signup/:id')
  createRef(@Body() createUserDto: CreateUserDto, @Param('id') ref: string) {
    return this.usersService.createRef(createUserDto, ref);
  }

  @Post('login')
  async login(@Body() body: userLogin) {
    return this.usersService.login(body);
  }

  @Patch('forgotpassword')
  async reset(@Body() body: updateDto) {
    return this.usersService.resetPassword(body);
  }

  @UseGuards(AuthGuard)
  @Patch('changepassword')
  async change(@Body() body: updateDto, @Req() req) {
    return this.usersService.changePassword(req, body);
  }

  //auth guard
  @UseGuards(AuthGuard)
  @Patch('profile')
  async update(@Body() body: updateDto, @Req() req) {
    return this.usersService.update(req, body);
  }

  @Delete()
  remove(@Req() req) {
    return this.usersService.remove(req);
  }
}
