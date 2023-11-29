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
  constructor(private readonly authService: AuthService) {}

  @Get('verifyOtp')
  verify(@Body() data: autheoObj) {
    return this.authService.verifyOTP(data);
  }

  @Get('sendOtp')
  sendOTP(@Body() data: autheObj) {
    return this.authService.sendOTP(data);
  }

  @Get('resendOtp')
  resendOTP(@Body() data: autheObj) {
    return this.authService.resendOTP(data);
  }

  // @Get('testemail')
  // tesOTP(@Body() data: autheObj) {
  //   return this.authService.sendEmail(data, 123);
  // }/

  @Get('sendRiderOtp')
  sendRiderOTP(@Body() data: autheObj) {
    return this.authService.sendRiderOTP(data);
  }

  @Get('verifyRiderOtp')
  verifyRider(@Body() data: autheoObj) {
    return this.authService.verifyRiderOTP(data);
  }
}
