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
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dto/createOrder.dto';


@Controller('order')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) { }

  @Post()
  create(@Body() body: CreateOrderDto, @Req() req) {
    return this.orderService.create(body, req);
  }

  @Get('all')
  getOrders(@Body() body, @Req() req) {
    return this.orderService.findOrders(body, req);
  }

  @Get()
  getOrder(@Body() body, @Req() req) {
    return this.orderService.findOrder(body, req);
  }

  @Post('review')
  rating(@Body() body, @Req() req) {
    return this.orderService.rate(body, req);
  }
}
