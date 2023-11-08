import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
var jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
    private authService: AuthService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userConnection.findOneBy({
        email: createUserDto.email,
      });
      if (user) {
        createUserDto.password = await this.authService.encrypt(
          createUserDto.password
        );
        let newData = await this.userConnection.save(createUserDto);
        console.log(createUserDto);

        return {
          status: true,
          message: 'user Created successfully',
        };
      } else {
        return {
          status: false,
          data: 'Create a user first',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        data: error,
        status: false,
        message: 'error in creating data',
      };
    }
  }
  //   async login(body) {
  //     try {
  //       let data:User = await this.userConnection.findOne({
  //         where: { email: body.email },
  //       });
  //       const passwordIsMatch = await bcrypt.compare(
  //         body.password,
  //         data?.password || ''
  //       );
  //       if (data && passwordIsMatch) {
  //         const { password, ref_by, referrals, ...Filterdata } = data;
  //         var token = jwt.sign(
  //           {
  // data

  //             email: data.email,
  //             id: data.id,
  //             first_name: data.first_name,
  //             last_name: data.last_name,
  //           },
  //           process.env.DEFAULT_SECRET,
  //           { expiresIn: '24h' }
  //         );
  //         //filterout password,
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
