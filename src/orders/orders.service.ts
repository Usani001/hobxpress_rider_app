import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/createOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderConnection: Repository<Order>,
    private authService: AuthService
  ) { }

  async create(body: CreateOrderDto, req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      body['user_id'] = tokUser.data.id;
      const saveOrder = await this.orderConnection.save(body);
      return {
        status: true,
        message: 'Order Created',
      };
    } catch (error) {
      return {
        status: false,
        message: 'Error',
      };
    }
  }

  async findOrder(body, req) {
    try {
      if (req) {
        const tokUser = await this.authService.getLoggedInUser(req);
        const getOrder = await this.orderConnection.find({
          where: { user_id: tokUser.data.id },
        });
        return {
          status: true,
          message: 'Order Found',
          data: getOrder,
        };
      }
      const getOrder = await this.orderConnection.findOne({
        where: { id: body.id },
      });
      return {
        status: true,
        message: 'Order Found',
        data: getOrder,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Order Found',
        data: error,
      };
    }
  }
}
