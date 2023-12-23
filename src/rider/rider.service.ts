import { Injectable } from '@nestjs/common';
import { RiderDto } from './dtos/rider.dto';
import { Rider } from './entity/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { riderLogin, updateRiderDto } from './rider.controller';
import * as bcrypt from 'bcrypt';
import { Order, orderType } from 'src/orders/entity/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { stringify } from 'querystring';
import { CreateOrderDto } from 'src/orders/dto/createOrder.dto';
var jwt = require('jsonwebtoken');



@Injectable()
export class RiderService {

    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>,
        private authService: AuthService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly orderService: OrdersService,
    ) { }

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
            // if (body.email) {
            //     getRider.email = body.email;
            // }

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

    //update password , forgot passwod, set password to randomstring, send randstring to email
    // async resetRiderPassword(body: updateRiderDto) {
    //     try {
    //         const getRider = await this.riderRepository.findOne({
    //             where: { email: body.email },
    //         });
    //         const randomPass = await this.authService.generateRandomString(10);
    //         //send to user email
    //         console.log(randomPass);
    //         const password = await this.authService.encrypt(randomPass);
    //         getRider.password = password;
    //         await this.riderRepository.save(getRider);
    //         return { status: true, message: 'New password sent' };
    //     } catch (error) {
    //         return { status: false, message: error };
    //     }
    // }

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
            const order = await this.orderService.changeOrderTypeToInProgress({ id: orders.id })


            if (order.status === true && request.riderResponse === 'ACCEPT' &&
                rider) {
                const accept = [...rider.acceptedOrders, order.data];
                rider.acceptedOrders = accept;
                const saveRider = await this.riderRepository.save(rider)

                return {
                    status: true,
                    message: 'Rider has accepted order',
                    data: order.data,
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
            const rider = await this.riderRepository.findOneBy({ id: riderToken.data.id })
            const order = await this.orderService.changeOrderTypeToCompleted({ id: orders.id })
            if (order) {
                const orderIndex = rider.acceptedOrders.findIndex(order => order.id === orders.id);
                const accept = [...rider.completedOrders, order.data];
                orderIndex !== -1 ? rider.completedOrders = accept : null
                orderIndex !== -1 ? rider.acceptedOrders.splice(orderIndex, 1) : null
                const saveRider = await this.riderRepository.save(rider)

                return {
                    status: true,
                    message: 'Rider has completed order delivery',
                    data: order.data,
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

    async getRiderRatings(orders: Order, req) {
        try {
            const riderToken = await this.authService.getLoggedInUser(req);
            const rider = await this.riderRepository.findOneBy({ id: riderToken.data.id })
            const order = await this.orderService.checkIfOrderRated({ id: orders.id })


            if (order) {
                order.data.ratings > 0 ? rider.ratedOrder++ : rider.ratedOrder
                rider.totalRatings = rider.totalRatings + order.data.ratings;
                rider.riderRatings = rider.totalRatings / rider.ratedOrder
                const saveRider = await this.riderRepository.save(rider)

                return {
                    status: true,
                    message: 'Rider ratings has been updated Suceessfully',
                    riderRatings: rider.riderRatings,
                    acceptOrders: rider.acceptedOrders.length,
                    completedOrders: rider.completedOrders.length,
                }

            }
            return {
                status: false,
                message: 'Rider has already rated with respect to this order'
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
                console.log(rider)
                return {

                    status: true,
                    message: 'Orders Found',
                    acceptedOrders: rider.acceptedOrders,
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




}




