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

  async orderCost(body: CreateOrderDto, req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?approaches=curb;curb&access_token=${this.apiKey}`;
      const response = await axios.get(url);
      const distanceInKm = response.data.destinations[1].distance / 1000;
      const amountCharged = distanceInKm * this.amountPerKm;
      const roundedAmountCharged = Math.round(amountCharged);
      return {
        status: true,
        message: 'Returned order cost and distance',
        orderCost: roundedAmountCharged.toLocaleString(),
        orderDistance: distanceInKm.toFixed(2),
      }
    } catch (error) {
      console.log(error)
      return {
        status: false,
        message: 'Error in fetching order cost and order distance',
      }
    }


  }
  async create(body: CreateOrderDto, req) {
    const tokUser = await this.authService.getLoggedInUser(req);
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?approaches=curb;curb&access_token=${this.apiKey}`;

    try {

      const response = await axios.get(url);
      const distanceInKm = response.data.destinations[1].distance / 1000;
      const amountCharged = distanceInKm * this.amountPerKm;
      const roundedAmountCharged = Math.round(amountCharged);
      const formattedAmountCharged = roundedAmountCharged.toLocaleString();
      body['user_id'] = tokUser.data.id;
      body['order_cost'] = formattedAmountCharged;
      body['distance'] = distanceInKm.toFixed(2);

      const saveOrder = await this.orderConnection.save(body);
      console.log(saveOrder)

      console.log(response.data.destinations)
      console.log('Distance: ' + distanceInKm, 'Amount: ' + amountCharged);
      return {
        status: true,
        message: 'Order Created',
      };

    } catch (error) {
      console.log(error)
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
