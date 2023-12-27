import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from './entity/orders.entity';
import { Rider } from 'src/rider/entity/rider.entity';


@Controller('order')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) { }



  @Post()
  create(@Body() body: CreateOrderDto, @Req() req) {
    return this.orderService.create(body, req);
  }

  @Get('all')
  getOrders(@Req() req) {
    return this.orderService.findOrders(req);
  }

  @Get('one-order')
  getOrder(@Body() body) {
    return this.orderService.findOrder(body);
  }

  @Post('review')
  rating(@Body() body, @Req() req) {
    return this.orderService.rate(body, req);
  }

  @Get('order-cost')
  orderCost(@Body() body: CreateOrderDto, @Req() req) {
    return this.orderService.orderCost(body, req);
  }
}
