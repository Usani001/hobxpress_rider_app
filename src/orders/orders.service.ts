import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import axios from 'axios';
import { User } from 'src/users/entity/user.entity';
import { RiderService } from 'src/rider/rider.service';



@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderConnection: Repository<Order>,
    private authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly riderService: RiderService,
  ) { }

  private apiKey: string = process.env.APIKEY;
  private amountPerKm: any = process.env.AMOUNTPERKM;

  async orderCost(body: CreateOrderDto, req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?destinations=0,sources=0&annotations=distance&access_token=${this.apiKey}`
      const response = await axios.get(url);
      const distanceInKm = response.data.distances[1][0] / 1000;
      const roundedDistance = Math.ceil(distanceInKm)
      const amountCharged = roundedDistance * this.amountPerKm;
      const roundedAmountCharged = Math.ceil(amountCharged / 50) * 50;
      return {
        status: true,
        message: 'Returned order cost and distance',
        orderCost: roundedAmountCharged.toLocaleString(),
        orderDistance: roundedDistance.toFixed(),
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
    const user = await this.userRepository.findOneBy({ id: tokUser.data.id })
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?destinations=0,sources=0&annotations=distance&access_token=${this.apiKey}`

    try {
      const response = await axios.get(url);
      const distanceInKm = response.data.distances[1][0] / 1000;
      const roundedDistance = Math.ceil(distanceInKm)
      const amountCharged = roundedDistance * this.amountPerKm;
      const roundedAmountCharged = Math.ceil(amountCharged / 50) * 50;
      const formattedAmountCharged = roundedAmountCharged.toLocaleString();
      body['user_id'] = user.id;
      body['order_cost'] = formattedAmountCharged;
      body['distance'] = roundedDistance.toFixed(0);
      body['user_phone_no'] = user.phone_number;
      const saveOrder = await this.orderConnection.save(body);

      const notification = {
        headerText: 'Order Created', body: `Your order to be delivered to ${body.delivery_add} has been successfully created`, time: this.riderService.getFormattedDateTime()
      };

      const userNotification = [notification, ...user.notifications]
      user.notifications = userNotification
      const saveUser = await this.userRepository.save(user)
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
