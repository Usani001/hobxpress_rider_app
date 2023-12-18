import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderDto } from './dtos/rider.dto';
import { Order } from 'src/orders/entity/orders.entity';
import { IsNotEmpty } from 'class-validator';

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

    // @Patch('forgotpassword')
    // async resetRiderPassword(@Body() request: updateRiderDto) {
    //     return this.riderService.resetRiderPassword(request);
    // }

    //auth guard
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

    @Post('accept-order')
    async acceptOrder(@Body() rider: RiderDto, @Body() orders: Order, @Req() req) {
        return this.riderService.acceptOrder(rider, orders, req);
    }

    @Get('get-nearby-rider')
    async findNearbyRider(@Body() rider: RiderDto) {
        return this.riderService.getNearbyRiders(rider);
    }

}
function Ref(): (target: RiderController, propertyKey: "createRider", parameterIndex: 1) => void {
    throw new Error('Function not implemented.');
}

