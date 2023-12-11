import { Injectable } from '@nestjs/common';
import { RiderDto } from './dtos/rider.dto';
import { Rider } from './entity/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { riderLogin, updateRiderDto } from './rider.controller';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/orders/entity/orders.entity';
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
    ) { }

    async createRider(createRiderDto: RiderDto) {
        try {
            const user = await this.riderRepository.findOneBy({
                email: createRiderDto.email,
            });
            if (user) {
                createRiderDto.password = await this.authService.encrypt(
                    createRiderDto.password,
                );
                // createRiderDto = user
                user.first_name = createRiderDto.first_name;
                user.last_name = createRiderDto.last_name;
                user.password = createRiderDto.password;
                console.log(user);

                let newData = await this.riderRepository.save(user);
                console.log(newData);

                return {
                    status: true,
                    message: 'Rider Created successfully',
                };
            } else {
                return {
                    status: false,
                    data: 'Create a Rider first',
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
            let data: Rider = await this.riderRepository.findOne({
                where: { email: request.email },
            });
            if (!data.password || !data.first_name || !data.last_name) {
                return {
                    status: false,
                    message: 'Finish setting up your profile',
                    data: 101,
                };
            }
            const passwordIsMatch = await bcrypt.compare(
                request.password,
                data?.password || ''
            );
            if (data && passwordIsMatch) {
                const {
                    password,
                    // ref_by,
                    // ref_code,
                    // referrals,
                    otp_token,
                    ...Filterdata
                } = data;
                var token = jwt.sign(
                    {
                        data: Filterdata,
                    },
                    process.env.DEFAULT_SECRET,
                    { expiresIn: '24h' }
                );
                //filterout password,
                return {
                    status: true,
                    token: token,
                    data: Filterdata,
                    message: 'login successfully',
                };
            } else {
                return {
                    status: false,
                    message: 'login failed, either email or password is wrong',
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
            if (body.password) {
                const password = await this.authService.encrypt(body.password);
                getRider.password = password;
            }
            if (body.email) {
                getRider.email = body.email;
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

    //update password , forgot passwod, set password to randomstring, send randstring to email
    async resetRiderPassword(body: updateRiderDto) {
        try {
            const getRider = await this.riderRepository.findOne({
                where: { email: body.email },
            });
            const randomPass = await this.authService.generateRandomString(10);
            //send to user email
            console.log(randomPass);
            const password = await this.authService.encrypt(randomPass);
            getRider.password = password;
            await this.riderRepository.save(getRider);
            return { status: true, message: 'New password sent' };
        } catch (error) {
            return { status: false, message: error };
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


    async getAllRiders(req) {
        try {
            if (req) {
                const riderToken = await this.authService.getLoggedInUser(req);
                const getRider = await this.riderRepository.findOne({
                    where: { id: riderToken.data.id },
                });
                delete getRider.password
                return {
                    status: true,
                    message: 'Rider Found',
                    data: getRider,
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


    async acceptOrder(rider: RiderDto, orders: Order, req) {
        try {
            const riderToken = await this.authService.getLoggedInUser(req);

            const order = await this.orderRepository.findOne({ where: { id: orders.id } });
            if (order.rider === null && rider.riderResponse === 'ACCEPT') {
                rider.order = [order];
                rider.id = riderToken.id;
                const saveRider = await this.riderRepository.save(rider);
                order.rider = saveRider;
                await this.orderRepository.save(order);
                return {
                    status: true,
                    message: 'Rider has accepted order',
                    data: saveRider
                }
            } else if (rider.riderResponse === 'REJECT') {
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
            return {
                status: false,
                message: 'Error in rider response'
            }
        }


    }
    async getNearbyRiders(rider: RiderDto): Promise<Rider[]> {
        const radius = 10; // Adjust as needed, measured in kilometers

        return this.riderRepository
            .createQueryBuilder('rider')
            .select()
            .addSelect(
                `earth_distance(ll_to_earth(${rider.latitude}, ${rider.longitude}), ll_to_earth(rider.latitude, rider.longitude))`,
                'distance',
            )
            .where(
                `earth_distance(ll_to_earth(${rider.latitude}, ${rider.longitude}), ll_to_earth(rider.latitude, rider.longitude)) <= :radius`,
                { radius },
            )
            .orderBy('distance', 'ASC')
            .limit(1)
            .getMany();
    }


}




