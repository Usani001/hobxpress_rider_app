import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// var jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  //   constructor(
  //     @InjectRepository(User)
  //     private readonly userConnection: Repository<User>,
  //     private authService: AuthService
  //   ) {}
  //   async create(createUserDto: CreateUserDto) {
  //     const OTP = this.authService.generateOtp();
  //     try {
  //       const user = await this.userConnection.findOneBy({
  //         email: createUserDto.email,
  //       });
  //       if (user) {
  //         return {
  //           status: false,
  //           message: 'user exists',
  //         };
  //       }
  //       createUserDto.password = await this.authService.encrypt(
  //         createUserDto.password
  //       );
  //       let newData = await this.userConnection.save(createUserDto);
  //       console.log(createUserDto, 'test user');
  //       return {
  //         status: true,
  //         data: newData,
  //         message: 'user Created successfully',
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         data: error,
  //         status: false,
  //         message: 'error in creating data',
  //       };
  //     }
  //   }
  //   async login({
  //     emailOrPhone,
  //     password,
  //   }: {
  //     emailOrPhone: string;
  //     password: string;
  //   }) {
  //     try {
  //       let data: FetchUserDto = await this.userConnection.findOne({
  //         where: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
  //       });
  //       const passwordIsMatch = await bcrypt.compare(
  //         password,
  //         data?.password || ''
  //       );
  //       if (data.active === false) {
  //         return {
  //           status: false,
  //           message: 'User account is not active',
  //         };
  //       }
  //       if (data && passwordIsMatch) {
  //         var token = jwt.sign(
  //           {
  //             id: data.id,
  //             email: data.email,
  //             user_type: AdminType.USER,
  //             users_id: data.users_id,
  //             first_name: data.first_name,
  //             last_name: data.last_name,
  //           },
  //           process.env.DEFAULT_SECRET,
  //           { expiresIn: '24h' }
  //         );
  //         //filterout password,
  //         const { password, ref_by, referrals, ...Filterdata } = data;
  //         return {
  //           status: true,
  //           token: token,
  //           data: Filterdata,
  //           message: 'login successfully',
  //         };
  //       } else {
  //         return {
  //           status: false,
  //           message: 'login failed, either email or password is wrong',
  //         };
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         status: false,
  //         message: 'login failed',
  //       };
  //     }
  //   }
  //   remove(id: number) {
  //     try {
  //       this.userConnection.softDelete(id);
  //       return {
  //         status: true,
  //         message: 'deleted successfully',
  //       };
  //     } catch (error) {
  //       return {
  //         status: false,
  //         message: 'error',
  //       };
  //     }
  //   }
}
