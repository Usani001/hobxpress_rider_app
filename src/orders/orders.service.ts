import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, orderType } from './entity/orders.entity';
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
      console.log(saveOrder);
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

  async findOrders(req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const getOrder = await this.orderConnection.find({
        where: { user_id: tokUser.data.id },
      });
      return {
        status: true,
        message: 'Orders Found',
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

  async findOrder(body) {
    try {

      const getOrder = await this.orderConnection.findOneBy({
        id: body.id
      },
      );


      return {
        status: true,
        message: 'Order Found',
        data: getOrder,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }

  async changeOrderTypeToInProgress(body) {
    try {

      const getOrder = await this.orderConnection.findOneBy({
        id: body.id
      },
      );
      if (getOrder.type === orderType.ACTIVE) {
        getOrder.type = orderType.INPROGRESS
        const newOrder = await this.orderConnection.save(getOrder);

        return {
          status: true,
          message: 'Order Found',
          data: newOrder,
        };
      }
      return {
        status: false,
        message: 'Order Not found or has been accepted',

      }
    } catch (error) {
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }

  async changeOrderTypeToCompleted(body) {
    try {

      const getOrder = await this.orderConnection.findOneBy({
        id: body.id
      },
      );
      getOrder.type = orderType.COMPLETED
      const newOrder = await this.orderConnection.save(getOrder);

      return {
        status: true,
        message: 'Order Found',
        data: newOrder,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }


  async rate(body, req) {
    try {
      const getOrder = await this.orderConnection.findOne({
        where: { id: body.id },
      });
      if (body.rating) {
        getOrder.ratings = body.rating;
      }
      if (body.comment) {
        getOrder.comments = body.comment;
      }
      await this.orderConnection.save(getOrder);
      return {
        status: true,
        message: 'Review Added',
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
