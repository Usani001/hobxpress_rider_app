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
    private authService: AuthService
  ) { }

  private apiKey: string = 'YOUR_API_KEY';

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


  async computeRouteMatrix(order: CreateOrderDto): Promise<any> {
    const url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    const request = {
      "origins": [
        {
          "waypoint": {
            "location": {
              "latLng": {
                "latitude": order.latitude,
                "longitude": order.longitude
              }
            }
          },
          "routeModifiers": { "avoid_ferries": true }
        },
        {
          "waypoint": {
            "location": {
              "latLng": {
                "latitude": order.latitude,
                "longitude": order.longitude
              }
            }
          },
          "routeModifiers": { "avoid_ferries": true }
        }
      ],
      "destinations": [
        {
          "waypoint": {
            "location": {
              "latLng": {
                "latitude": order.latitude,
                "longitude": order.longitude
              }
            }
          }
        },
        {
          "waypoint": {
            "location": {
              "latLng": {
                "latitude": order.latitude,
                "longitude": order.longitude
              }
            }
          }
        }
      ],
      "travelMode": "DRIVE",
      "routingPreference": "TRAFFIC_AWARE"
    };

    try {
      const response = await axios.post(url, request, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
        },
      });
      console.log(response.data)
      return response.data;

    } catch (error) {
      console.log(error.message)
      throw new Error(`Error calling Google Distance Matrix API: ${error.message}`);
    }
  }

}
