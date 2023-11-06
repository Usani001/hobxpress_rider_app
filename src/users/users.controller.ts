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

// export class userLogoutFilterOptions {
//   emailOrPhone: string;
// }

@Controller('users')
export class UsersController {
  //   constructor(private readonly usersService: UsersService) {}
  //   @Post()
  //   create(
  //     @Body() createUserDto
  //     // : CreateUserDto
  //   ) {
  //     return this.usersService.create(createUserDto);
  //   }
  //   @Post('login')
  //   async login(
  //     @Body() data
  //     // : userLoginFilterOptions
  //   ) {
  //     return this.usersService.login(data);
  //   }
  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.usersService.remove(+id);
  //   }
}
