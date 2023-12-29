import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { updateDto, userLogin } from './users.controller';
var jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
    private authService: AuthService
  ) { }

  async createRef(createUserDto, ref) {
    try {
      const ref_code = ref.ref_code;
      const refcodeUser = await this.userConnection.findOneBy({
        ref_code: ref_code,
      });
      const user = await this.userConnection.findOneBy({
        email: createUserDto.email,
      });
      if (user) {
        createUserDto.password = await this.authService.encrypt(
          createUserDto.password
        );
        createUserDto['ref_by'] = refcodeUser.email;
        refcodeUser.referrals.push(createUserDto.email);

        user.first_name = createUserDto.first_name;
        user.last_name = createUserDto.last_name;
        user.password = createUserDto.password;
        console.log(user);

        let newData = await this.userConnection.save(user);
        await this.userConnection.save(refcodeUser);
        console.log(newData);

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
      return {
        data: error,
        status: false,
        message: 'error in creating data',
      };
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userConnection.findOneBy({
        email: createUserDto.email,
      });
      if (user) {
        createUserDto.password = await this.authService.encrypt(
          createUserDto.password
        );
        // createUserDto = user
        user.first_name = createUserDto.first_name;
        user.last_name = createUserDto.last_name;
        user.password = createUserDto.password;
        console.log(user);

        let newData = await this.userConnection.save(user);
        console.log(newData);

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
      return {
        data: error,
        status: false,
        message: 'error in creating data',
      };
    }
  }

  async findUser(req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const getUser = await this.userConnection.findOne({
        where: { id: tokUser.data.id },
      });
      if (!getUser || getUser.deletedAt) {
        return { status: false, message: 'User not found' };
      }
      return { status: true, message: 'user found', data: getUser };
    } catch (error) {
      return { status: true, message: 'error', data: error };
    }
  }

  async login(body: userLogin) {
    try {
      let data: User = await this.userConnection.findOne({
        where: { email: body.email },
      });
      if (!data.password || !data.first_name || !data.last_name) {
        return {
          status: false,
          message: 'Finish setting up your profile',
          data: 101,
        };
      }
      const passwordIsMatch = await bcrypt.compare(
        body.password,
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
          process.env.DEFAULT_SECRET
          // { expiresIn: '24h' }
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

  //update user email first lastname number and password
  async update(req, body: updateDto) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const getUser = await this.userConnection.findOne({
        where: { id: tokUser.data.id },
      });

      if (body.first_name) {
        getUser.first_name = body.first_name;
      }
      if (body.last_name) {
        getUser.last_name = body.last_name;
      }
      // if (body.password) {
      //   const password = await this.authService.encrypt(body.password);
      //   getUser.password = password;
      // }/
      if (body.email) {
        getUser.email = body.email;
      }

      await this.userConnection.save(getUser);
      return {
        status: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        status: true,
        message: 'error updating user',
      };
    }
  }

  //update password , forgot passwod, set password to randomstring, send randstring to email
  async resetPassword(body: updateDto) {
    try {
      const getUser = await this.userConnection.findOne({
        where: { email: body.email },
      });
      const randomPass = await this.authService.generateRandomString(10);
      //send to user email
      await this.authService.sendEmail(body.email, randomPass);
      console.log(randomPass);
      const password = await this.authService.encrypt(randomPass);
      getUser.password = password;
      await this.userConnection.save(getUser);
      return { status: true, message: 'New password sent' };
    } catch (error) {
      return { status: false, message: error };
    }
  }

  async changePassword(req, body: updateDto) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const getUser = await this.userConnection.findOne({
        where: { email: tokUser.data.email },
      });
      const passwordIsMatch = await bcrypt.compare(
        body.old_password,
        getUser?.password || ''
      );
      if (passwordIsMatch) {
        const password = await this.authService.encrypt(body.password);
        getUser.password = password;
        await this.userConnection.save(getUser);
        return { status: true, message: 'New password set' };
      } else {
        return {
          status: false,
          message: 'Incorrect Old Passowrd',
        };
      }
    } catch (error) {
      return { status: false, message: error };
    }
  }

  async remove(req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      await this.userConnection.delete(tokUser.data.id);
      return {
        status: true,
        message: 'deleted successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  async notifications(req) {
    try {
      const tokUser = await this.authService.getLoggedInUser(req);
      const user = await this.userConnection.findOneBy({ id: tokUser.data.id });
      const notifications = user.notifications;
      return {
        status: true,
        message: 'Notifications Fetched',
        data: notifications,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}
