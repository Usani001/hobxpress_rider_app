import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderDto } from './dtos/rider.dto';

export class riderLogin {
    email: string;
    password: string;
}
export class refCode {
    referal_code: string;
}

export class updateRiderDto {
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
}

@Controller('rider')
export class RiderController {

    constructor(private readonly riderService: RiderService) { }


    @Post('create-rider')
    async createRider(@Body() createRiderDto: RiderDto, @Query() query: refCode) {
        return this.riderService.createRider(createRiderDto, query);
    }

    @Post('login-rider')
    async login(@Body() request: riderLogin) {
        return this.riderService.loginRider(request);
    }

    @Patch('forgotpassword')
    async resetRiderPassword(@Body() request: updateRiderDto) {
        return this.riderService.resetRiderPassword(request);
    }

    //auth guard
    @Patch('profile')
    async updateRider(@Body() request: updateRiderDto, @Req() req) {
        return this.riderService.updateRider(request, req);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.riderService.removeRider(id, req);
    }
}
