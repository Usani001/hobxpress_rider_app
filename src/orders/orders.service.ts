import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, orderType } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import axios from 'axios';
import { User } from 'src/users/entity/user.entity';
import { Rider } from 'src/rider/entity/rider.entity';
import { RiderDto } from 'src/rider/dtos/rider.dto';



@Injectable()
export class OrdersService {
  dateFormatter: Intl.DateTimeFormat;
  timeFormatter: Intl.DateTimeFormat;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private authService: AuthService,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {
    this.dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'numeric', day: '2-digit', year: 'numeric' });
    this.timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  getFormattedDateTime(): string {
    const date = new Date();
    const formattedDate = this.dateFormatter.format(date);
    const formattedTime = this.timeFormatter.format(date);
    return `${formattedDate}|${formattedTime}`;
  }

  private apiKey: string = process.env.APIKEY;
  private amountPerKm: any = process.env.AMOUNTPERKM;

  async orderCost(body: CreateOrderDto, req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?destinations=0,sources=0&annotations=distance&access_token=${this.apiKey}`
      const response = await axios.get(url);
      const distanceInKm = response.data.distances[1][0] / 1000;
      const roundedDistance = Math.ceil(distanceInKm);
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
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${body.geo_pickup};${body.geo_delivery}?destinations=0,sources=0&annotations=distance&access_token=${this.apiKey}`;

    try {
      const response = await axios.get(url);
      const distanceInKm = response.data.distances[1][0] / 1000;
      const roundedDistance = Math.ceil(distanceInKm);
      const amountCharged = roundedDistance * this.amountPerKm;
      const roundedAmountCharged = Math.ceil(amountCharged / 50) * 50;
      const formattedAmountCharged = roundedAmountCharged.toLocaleString();
      body['user_id'] = user.id;
      body['order_cost'] = formattedAmountCharged;
      body['distance'] = roundedDistance.toFixed(0);
      const saveOrder = await this.orderRepository.save(body);

      const notification = {
        headerText: 'Order Created', body: `Your order to be delivered to ${body.delivery_add} has been successfully created`, time: this.getFormattedDateTime()
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
      const getOrder = await this.orderRepository.find({
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
      const getOrder = await this.orderRepository.findOneBy({
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
      const getOrder = await this.orderRepository.findOne({
        where: { id: body.id },
      });

      if (body.rating) {
        getOrder.ratings = body.rating;
      }
      if (body.comment) {
        getOrder.comments = body.comment;
      }
      await this.orderRepository.save(getOrder);
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


  async acceptOrder(request: RiderDto, orders: Order, req) {
    try {
      const riderToken = await this.authService.getLoggedInUser(req);
      const rider = await this.riderRepository.findOneBy({ id: riderToken.data.id })
      const order = await this.orderRepository.findOneBy({ id: orders.id })

      if (order.type === orderType.ACTIVE && request.riderResponse === 'ACCEPT' &&
        rider) {
        order.type = orderType.INPROGRESS
        order.rider_id = rider.id
        const accept = [order, ...rider.acceptedOrders];
        order.rider_id = rider.id
        order.rider_phone_no = rider.phone_number;
        rider.acceptedOrders = accept;
        const user = await this.userRepository.findOneBy({ id: order.user_id });
        const notificationUser = { headerText: 'Pick Up Confirmed', body: 'Your item has been assigned to a rider', time: this.getFormattedDateTime() };
        const notificationRider = {
          headerText: 'Pick Up Confirmed', body: 'You accepted a pickup from ' + user.first_name + ' ' + user.last_name, time: this.getFormattedDateTime()
        };
        const riderNotification = [notificationRider, ...rider.notifications];
        rider.notifications = riderNotification;
        const userNotification = [notificationUser, ...user.notifications];
        user.notifications = userNotification;
        const saveOrder = await this.orderRepository.save(order);
        const saveUser = await this.userRepository.save(user)
        const saveRider = await this.riderRepository.save(rider);

        return {
          status: true,
          message: 'Rider has accepted order',
          data: saveOrder,
        }
      } else if (request.riderResponse === 'REJECT' && order.type === orderType.ACTIVE) {
        return {
          status: true,
          message: 'Rider has rejected order',
        }
      }
      return {
        status: false,
        message: 'Rider or Order not found'
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Error in rider response',
        data: error
      }
    }
  }

  async completeAnOrder(orders: Order, req) {
    try {
      const riderToken = await this.authService.getLoggedInUser(req);
      const rider = await this.riderRepository.findOneBy({ id: riderToken.data.id });
      const order = await this.orderRepository.findOneBy({ id: orders.id });
      if (order.type === orderType.INPROGRESS && rider) {
        const orderIndex = rider.acceptedOrders.findIndex(order => order.id === orders.id);
        order.type = orderType.COMPLETED
        const accept = [order, ...rider.completedOrders];
        orderIndex !== -1 ? rider.completedOrders = accept : rider.completedOrders
        orderIndex !== -1 ? rider.acceptedOrders.splice(orderIndex, 1) : rider.completedOrders;

        const user = await this.userRepository.findOneBy({ id: order.user_id })
        const notificationUser = { headerText: 'Item Delivered', body: 'Your item has been delivered successfully', time: this.getFormattedDateTime() };
        const notificationRider = {
          headerText: 'Item Delivered', body: `You have delivered an item to ${order.delivery_add} successfully`, time: this.getFormattedDateTime()
        };
        const userNotification = [notificationUser, ...user.notifications]
        const riderNotification = [notificationRider, ...rider.notifications]
        user.notifications = userNotification
        rider.notifications = riderNotification;
        const saveOrder = await this.orderRepository.save(order);
        const saveRider = await this.riderRepository.save(rider);
        const saveUser = await this.userRepository.save(user);
        return {
          status: true,
          message: 'Rider has completed order delivery',
          data: saveOrder,
        }
      }
      return {
        status: false,
        message: 'Rider or Order not found'
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Error in rider response',
        data: error
      }
    }
  }

  async getAcceptedOrders(req) {

    try {
      const tokUser = await this.authService.getLoggedInUser(req);

      const rider = await this.riderRepository.findOneBy({
        id: tokUser.data.id
      });
      if (rider.acceptedOrders.length >= 0) {
        console.log(rider.acceptedOrders);
        return {
          status: true,
          message: 'Orders Found',
          numberOfAcceptedOrders: rider.acceptedOrders.length,
          acceptedOrders: rider.acceptedOrders,
        }
      }
      return {
        status: false,
        message: 'Order or Rider Not Found',

      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }

  async getCompletedOrders(req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);

      const rider = await this.riderRepository.findOneBy({
        id: tokUser.id
      });

      if (rider.completedOrders.length >= 0) {
        console.log(rider)
        return {

          status: true,
          message: 'Orders Found',
          numberOfCompletedOrders: rider.completedOrders.length,
          completedOrders: rider.completedOrders,
        }
      }

      return {
        status: false,
        message: 'Order or Rider Not Found',

      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Order Not Found',
        data: error,
      };
    }
  }

  async getActiveOrders(req) {
    const tokUser = await this.authService.getLoggedInUser(req);
    const rider = await this.riderRepository.findOneBy({ id: tokUser.data.id })

    try {
      if (rider) {
        const radius = 10000;
        const orders = await this.orderRepository
          .createQueryBuilder('order')
          .select()
          .addSelect(`earth_distance(ll_to_earth(${rider.latitude},${rider.longitude}),ll_to_earth(order.pickupLatitude, order.pickupLongitude))`,
            'distance',)
          .where(`earth_distance(ll_to_earth(${rider.latitude},${rider.longitude}),ll_to_earth(order.pickupLatitude, order.pickupLongitude))<=${radius} `
          )
          .orderBy('distance', 'ASC')
          .limit(10)
          .getMany();

        const riderLocation = `${rider.longitude},${rider.latitude}`;

        for (const order of orders) {
          if (order.type === orderType.ACTIVE) {
            const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${riderLocation};${order.geo_pickup}?destinations=0,sources=0&annotations=distance&access_token=${this.apiKey}`;
            const response = await axios.get(url);
            const distanceInKm = response.data.distances[1][0] / 1000;
            order.riderDistance = Math.ceil(distanceInKm).toFixed();
            await this.orderRepository.save(order);
          }
        }
        const activeOrders = orders.filter(order => order.type === orderType.ACTIVE);
        if (activeOrders.length >= 0) {
          return {
            status: true,
            message: 'Active Orders Fetched',
            numberOfActiveOrders: activeOrders.length,
            data: activeOrders,
          };
        }
        return {
          status: false,
          message: 'No active orders found'
        };
      }
      return {
        status: false,
        message: 'Rider not found'
      };
    } catch (error) {
      console.log(error);
      return error
    }
  }
}
