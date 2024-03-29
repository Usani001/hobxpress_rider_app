import { Injectable } from '@nestjs/common';
import { Rider } from './entity/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { riderLogin, updateRiderDto } from './rider.controller';
import { OrdersService } from 'src/orders/orders.service';
import { Order, orderType } from 'src/orders/entity/orders.entity';
var jwt = require('jsonwebtoken');



@Injectable()
export class RiderService {


    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>,
        private orderService: OrdersService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private authService: AuthService,


    ) {

    }

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
        const riderTok = await this.authService.getLoggedInUser(req);
        const rider = await this.riderRepository.findOneBy({ id: riderTok.data.id });
        try {
            for (const order of rider.completedOrders) {
                if (order.type === orderType.COMPLETED && order.rated === false && order.ratings !== 0) {
                    rider.totalRatings += order.ratings;
                    rider.ratedOrder++;
                    rider.riderRatings = rider.totalRatings / rider.ratedOrder;
                    order.rated = true;
                    const saveOrder = await this.orderRepository.save(order);
                    const saveRider = await this.riderRepository.save(rider);
                }
            }
            const {
                reg_code,
                notifications,
                acceptedOrders,
                completedOrders,
                password,
                deletedAt,
                ...Filterdata
            } = rider;
            const totalOrders = rider.acceptedOrders.length + rider.completedOrders.length;
            return {
                status: true,
                message: 'Rider Profile returned',
                totalOrders: totalOrders,
                rating: rider.riderRatings,
                rider: Filterdata
            }


        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Error in fetching details'
            }
        }
    }


    async loginRider(request: riderLogin) {
        try {
            const data: Rider = await this.riderRepository.findOne({
                where: { reg_code: request.reg_code }
            });
            if (data) {
                const {
                    reg_code,
                    riders_company,
                    notifications,
                    acceptedOrders,
                    completedOrders,
                    latitude,
                    longitude,
                    password,
                    deletedAt,
                    ...Filterdata
                } = data;
                var token = jwt.sign(
                    {
                        data: Filterdata,
                    },
                    process.env.DEFAULT_SECRET
                    // { expiresIn: '24h' }
                );
                const notification = {
                    headerText: 'Login Successful', body: 'You successfully logged into your account', time: this.orderService.getFormattedDateTime()
                };
                const riderNotification = [notification, ...data.notifications];
                data.notifications = riderNotification;
                await this.riderRepository.save(data);

                return {
                    status: true,
                    token: token,
                    data: Filterdata,
                    message: 'login successful',
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
            const notification = {
                headerText: 'Profile Update', body: 'You successfully Updated your profile', time: this.orderService.getFormattedDateTime()
            };
            const riderNotification = [notification, ...getRider.notifications];
            getRider.notifications = riderNotification;

            await this.riderRepository.save(getRider);
            return {
                status: true,
                message: 'Rider updated successfully',
            };
        } catch (error) {
            console.log(error)
            return {
                status: false,
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
                    data: 'Latitude: ' + rider.latitude + '  ' + 'Longitude: ' + rider.longitude,
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


    async notifications(req) {

        const riderToken = await this.authService.getLoggedInUser(req);
        const rider = await this.riderRepository.findOneBy({ id: riderToken.data.id });
        try {
            if (rider) {
                return {
                    status: true,
                    message: 'Notifications fetched',
                    data: rider.notifications,
                }
            }
            return {
                status: false,
                message: 'Rider not found',
            }
        } catch (error) {
            console.log('Error found: ' + error);
            return {
                status: false,
                message: 'Error fetching notifications'
            }
        }

    }

}




