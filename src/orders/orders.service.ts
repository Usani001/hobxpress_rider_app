import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, orderType } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import axios from 'axios';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderConnection: Repository<Order>,
    private authService: AuthService,
  ) { }

  private apiKey: string = process.env.APIKEY;
  private amountPerKm: any = process.env.AMOUNTPERKM;

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
        message: 'Orders not Found',
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
      if (getOrder) {
        getOrder.type = orderType.INPROGRESS
        const newOrder = await this.orderConnection.save(getOrder);

        return {
          status: true,
          message: 'Order Found',
          data: getOrder,
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
      if (getOrder.type === orderType.INPROGRESS) {
        getOrder.type = orderType.COMPLETED
        const newOrder = await this.orderConnection.save(getOrder);

        return {
          status: true,
          message: 'Order Found',
          data: newOrder,
        }
      }
    } catch (error) {
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }

  async checkIfOrderRated(body) {
    try {

      const getOrder = await this.orderConnection.findOneBy({
        id: body.id
      },
      );
      if (getOrder.check === false) {
        getOrder.check = true
        const newOrder = await this.orderConnection.save(getOrder);

        return {
          status: true,
          message: 'Order Found',
          data: newOrder,
        }
      }
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


  async computeRouteMatrix(request: CreateOrderDto): Promise<any> {
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${request.pickup_add};${request.delivery_add}?approaches=curb;curb&access_token=${this.apiKey}`;
    try {
      const response = await axios.get(url);
      console.log(response.data)
      const distanceInKm = response.data.destinations[1].distance / 1000;
      const amountCharged = distanceInKm * this.amountPerKm
      return {
        status: true,
        message: 'Details returned',
        distance: distanceInKm,
        amount: amountCharged
      }

    } catch (error) {
      console.log(error.message)
      throw new Error(`Error calling Google Distance Matrix API: ${error.message}`);
    }
  }


}
