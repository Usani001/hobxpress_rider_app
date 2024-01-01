import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderDto } from './dtos/rider.dto';
import { Order } from 'src/orders/entity/orders.entity';
import { IsNotEmpty } from 'class-validator';
import { CreateOrderDto } from 'src/orders/dto/createOrder.dto';
import { Rider } from './entity/rider.entity';


export class riderLogin {
    @IsNotEmpty({ message: 'Please provide your registration code' })
    reg_code: string;

    @IsNotEmpty({ message: 'Please provide your company Name' })
    riders_company: string;
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
    async createRider(@Body() createRiderDto: riderLogin) {
        return this.riderService.createRider(createRiderDto);
    }

    @Post('login-rider')
    async login(@Body() request: riderLogin) {
        return this.riderService.loginRider(request);
    }


    @Patch('profile')
    async updateRider(@Body() request: updateRiderDto, @Req() req) {
        return this.riderService.updateRider(request, req);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.riderService.removeRider(id, req);
    }

    @Get('get-rider')
    async getRider(@Req() req) {
        return this.riderService.findRider(req);
    }

    @Post('location-update')
    updateLocation(@Body() request: Rider, @Req() req) {
        return this.riderService.liveLocation(request, req);
    }


    @Get('notifications')
    notifications(@Req() req) {
        return this.riderService.notifications(req);
    }

    @Get('rider-info')
    riderRatings(@Req() req) {
        return this.riderService.riderRatings(req);
    }
}


