import { Injectable } from '@nestjs/common';
import { RiderDto } from './dtos/rider.dto';
import { Rider } from './entity/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { riderLogin, updateRiderDto } from './rider.controller';
import { Order, orderType } from 'src/orders/entity/orders.entity';
import axios from 'axios';
import { User } from 'src/users/entity/user.entity';
var jwt = require('jsonwebtoken');



@Injectable()
export class RiderService {
    dateFormatter: Intl.DateTimeFormat;
    timeFormatter: Intl.DateTimeFormat;

    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>,
        private authService: AuthService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
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


    async createRider(createRiderDto: riderLogin) {
        try {
            const rider = await this.riderRepository.findOneBy({ reg_code: createRiderDto.reg_code });
            if (!rider) {
                const newRider = this.riderRepository.create();

                newRider.reg_code = createRiderDto.reg_code;
                newRider.riders_company = createRiderDto.riders_company;

                console.log(newRider);

                let newData = await this.riderRepository.save(newRider);
                console.log(newData);

                return {
                    status: true,
                    message: 'Rider Created successfully',
                    data: newRider
                };
            } else {
                return {
                    status: false,
                    data: 'Rider with registration code ' + createRiderDto.reg_code + ' already exist',
                };
            }
        } catch (error) {
            return {
                data: error,
                status: false,
                message: 'error in creating data',
            };
        }
    }

    async findRider(req) {
        try {
            const tokUser = await this.authService.getLoggedInUser(req);
            const getRider = await this.riderRepository.findOne({
                where: { id: tokUser.data.id },
            });
            if (!getRider || getRider.deletedAt) {
                return { status: false, message: 'Rider not found' };
            }
            return { status: true, message: 'Rider found', data: getRider };
        } catch (error) {
            return { status: true, message: 'error', data: error };
        }
    }


    async loginRider(request: riderLogin) {
        try {
            const isRider = await this.riderRepository.findOne({
                where: { reg_code: request.reg_code }
            });
            if (isRider) {
                const {
                    reg_code,
                    riders_company,
                    ...Filterdata
                } = isRider;
                var token = jwt.sign(
                    {
                        data: Filterdata,
                    },
                    process.env.DEFAULT_SECRET,
                    //{ expiresIn: '24h' }
                );

                return {
                    status: true,
                    token: token,
                    data: isRider,
                    message: 'login successfully',
                };
            } else {
                return {
                    status: false,
                    message: 'login failed, Please check your reg_code or company name',
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'login failed',
            };
        }
    }

    async updateRider(body: updateRiderDto, req) {
        try {
            const tokRider = await this.authService.getLoggedInUser(req);
            const getRider = await this.riderRepository.findOne({
                where: { id: tokRider.data.id },
            });

            if (body.first_name) {
                getRider.first_name = body.first_name;
            }
            if (body.last_name) {
                getRider.last_name = body.last_name;
            }

            await this.riderRepository.save(getRider);
            return {
                status: true,
                message: 'Rider updated successfully',
            };
        } catch (error) {
            return {
                status: true,
                message: 'error updating rider',
            };
        }
    }


    async removeRider(id: string, req) {
        try {
            if (req) {
                const tokRider = await this.authService.getLoggedInUser(req);
                await this.riderRepository.softDelete(tokRider.data.id);
                return {
                    status: true,
                    message: 'Rider deleted successfully',
                };
            }
            if (id) {
                await this.riderRepository.softDelete(id);
                return {
                    status: true,
                    message: 'deleted Rider successfully',
                };
            } else {
                return {
                    status: false,
                    message: 'error deleting',
                };
            }
        } catch (error) {
            return {
                status: false,
                message: error,
            };
        }
    }


    async getAllRiders() {
        try {
            const getRiders = await this.riderRepository.find();
            if (getRiders) {
                return {
                    status: true,
                    message: 'Rider Found',
                    data: getRiders,
                };
            }

        } catch (error) {
            return {
                status: false,
                message: 'Error in Fetching Rider',
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
                rider.acceptedOrders = accept;
                const saveOrder = await this.orderRepository.save(order);
                const saveRider = await this.riderRepository.save(rider);
                const user = await this.userRepository.findOneBy({ id: order.user_id })
                const notification = `Your item has been assigned to a rider ${this.getFormattedDateTime()}`;
                const userNotification = [notification, ...user.notifications]
                user.notifications = userNotification
                const saveUser = await this.userRepository.save(user)

                return {
                    status: true,
                    message: 'Rider has accepted order',
                    data: saveOrder,
                }


            } else if (request.riderResponse === 'REJECT') {
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
                const saveOrder = await this.orderRepository.save(order)
                const saveRider = await this.riderRepository.save(rider)
                const user = await this.userRepository.findOneBy({ id: order.user_id })
                const notification = `Your item has been delivered successfully ${this.getFormattedDateTime()}`;
                const userNotification = [notification, ...user.notifications]
                user.notifications = userNotification
                const saveUser = await this.userRepository.save(user)

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


    async liveLocation(request: Rider, req) {
        const tokUser = await this.authService.getLoggedInUser(req);
        const rider = await this.riderRepository.findOneBy({
            id: tokUser.data.id
        });
        try {
            if (rider) {
                rider.latitude = request.latitude;
                rider.longitude = request.longitude;
                await this.riderRepository.save(rider);
                return {
                    status: true,
                    message: 'Riders location has been updated successfully',
                    data1: 'Latitude: ' + rider.latitude + '  ' + 'Longitude: ' + rider.longitude,
                }
            }
            return {
                status: false,
                message: 'Error in finding Rider',
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getActiveOrders(req) {
        const tokUser = await this.authService.getLoggedInUser(req);
        const rider = await this.riderRepository.findOneBy({ id: tokUser.data.id })

        try {
            if (rider) {
                const radius = 5000;
                const orders = await this.orderRepository
                    .createQueryBuilder('order')
                    .select()
                    .addSelect(`earth_distance(ll_to_earth(${rider.latitude}, ${rider.longitude}), ll_to_earth(order.pickupLatitude, order.pickupLongitude))`,
                        'distance',)
                    .where(`earth_distance(ll_to_earth(${rider.latitude}, ${rider.longitude}), ll_to_earth(order.pickupLatitude, order.pickupLongitude)) <= ${radius} `
                    )
                    .orderBy('distance', 'ASC')
                    .limit(15)
                    .getMany();
                const riderLocation = `${rider.longitude},${rider.latitude}`

                for (const order of orders) {
                    if (order.type === orderType.ACTIVE) {
                        const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${riderLocation};${order.geo_pickup}?approaches=curb;curb&access_token=${this.apiKey}`;
                        const response = await axios.get(url);
                        const distanceInKm = response.data.destinations[1].distance / 1000;
                        order.riderDistance = distanceInKm.toFixed(2)
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
            console.log(error)
            return error
        }
    }
}




