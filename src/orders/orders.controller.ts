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
import { CreateOrderDto } from './dto/createOrder.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) { }

  @Post()
  create(@Body() body: CreateOrderDto, @Req() req) {
    return this.orderService.create(body, req);
  }

  @Get()
  getOrder(@Body() body, @Req() req) {
    return this.orderService.findOrder(body, req);
  }
}
