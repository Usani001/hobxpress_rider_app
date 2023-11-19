import { Body, Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

export class autheoObj {
  email: string;
  otp: number;
}
export class autheObj {
  email: string;
}
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('verifyOtp')
  verify(@Body() data: autheoObj) {
    return this.authService.verifyOTP(data);
  }

  @Get('sendOtp')
  sendOTP(@Body() data: autheObj) {
    return this.authService.sendOTP(data);
  }
}