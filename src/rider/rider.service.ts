import { Injectable } from '@nestjs/common';
import { RiderDto } from './dtos/rider.dto';
import { Rider } from './entity/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { riderLogin, updateRiderDto } from './rider.controller';
import * as bcrypt from 'bcrypt';
var jwt = require('jsonwebtoken');



@Injectable()
export class RiderService {

    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>,
        private authService: AuthService
    ) { }


    async createRef(createRiderDto, ref){}
    async createRider(createRiderDto: RiderDto, query) {
        if (query) {
            try {
                const ref_code = query.ref_code;
                const refcodeUser = await this.riderRepository.findOneBy({
                    ref_code: ref_code,
                });
                const rider = await this.riderRepository.findOneBy({
                    email: createRiderDto.email,
                });
                if (rider) {
                    createRiderDto.password = await this.authService.encrypt(
                        createRiderDto.password
                    );
                    createRiderDto['ref_by'] = refcodeUser.email;
                    refcodeUser.referrals.push(createRiderDto.email);
                    rider.first_name = createRiderDto.first_name;
                    rider.last_name = createRiderDto.last_name;
                    rider.password = createRiderDto.password;
                    console.log(rider);

                    let newData = await this.riderRepository.save(rider);
                    await this.riderRepository.save(refcodeUser);
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
        } else {
            try {
                const rider = await this.riderRepository.findOneBy({
                    email: createRiderDto.email,
                });
                if (rider) {
                    createRiderDto.password = await this.authService.encrypt(
                        createRiderDto.password
                    );
                    // createUserDto = user
                    rider.first_name = createRiderDto.first_name;
                    rider.last_name = createRiderDto.last_name;
                    rider.password = createRiderDto.password;
                    console.log(rider);

                    let newData = await this.riderRepository.save(rider);
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
    }


    async loginRider(request: riderLogin) {
        try {
            let data: Rider = await this.riderRepository.findOne({
                where: { email: request.email },
            });
            const passwordIsMatch = await bcrypt.compare(
                request.password,
                data?.password || ''
            );
            if (data && passwordIsMatch) {
                const {
                    password,
                    ref_by,
                    ref_code,
                    referrals,
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
                    message: 'deleted successfully',
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


}



