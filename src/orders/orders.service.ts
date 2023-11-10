import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderConnection: Repository<Order>,
    private authService: AuthService
  ) {}

  async create(body) {
    try {
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

  async findOrder(body) {
    try {
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
