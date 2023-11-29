import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { User } from 'src/users/entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { autheoObj } from './auth.controller';
import { Rider } from 'src/rider/entity/rider.entity';
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
    @InjectRepository(Rider)
    private readonly riderConnection: Repository<Rider>,
  ) {}

  saltOrRounds = Number(process.env.HASH_SALT);

  async encrypt(data: string) {
    const hash = await bcrypt.hash(data, this.saltOrRounds);
    return hash;
  }

  async sendOTP(data) {
    try {
      const user = await this.userConnection.findOneBy({ email: data.email });

      if (!user) {
        // Generate OTP
        const OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);

        const newUser = await this.userConnection.create();
        // Store OTP in the user's data or a temporary storage (e.g., a cache or session)
        newUser.otp_token = OTP;
        newUser.email = data.email;

        // Save the user data with the OTP to your database
        let last = await this.userConnection.save(newUser);

        // Send OTP to the user (e.g., via email or SMS)
        await this.sendEmail(data.email, OTP);
        console.log(last);

        //send otp email
        return {
          status: true,
          message: 'OTP sent: ' + newUser.otp_token,
        };
      } else {
        return {
          status: false,
          message: 'User already exists',
        };
      }
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  async sendRiderOTP(data) {
    try {
      const rider = await this.riderConnection.findOneBy({ email: data.email });

      if (!rider) {
        // Generate OTP
        const OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);

        const newRider = await this.userConnection.create();
        // Store OTP in the user's data or a temporary storage (e.g., a cache or session)
        newRider.otp_token = OTP;
        newRider.email = data.email;

        // Save the user data with the OTP to your database
        let last = await this.riderConnection.save(newRider);

        // Send OTP to the user (e.g., via email or SMS)
        await this.sendEmail(data.email, OTP);
        console.log(last);

        //send otp email
        return {
          status: true,
          message: 'OTP sent: ' + newRider.otp_token,
        };
      } else {
        return {
          status: false,
          message: 'Rider already exists',
        };
      }
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  async resendOTP(data) {
    try {
      const user = await this.userConnection.findOneBy({ email: data.email });

      const OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);

      user.otp_token = OTP;
      await this.userConnection.save(user);
      await this.sendEmail(data.email, OTP);

      return {
        status: true,
        message: 'OTP sent: ' + user.otp_token,
      };
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  async verifyOTP(data: autheoObj) {
    try {
      const user = await this.userConnection.findOne({
        where: { email: data.email },
      });
      if (user && user.otp_token === data.otp) {
        return {
          status: true,
          message: 'OTP is valid',
        };
      } else {
        return {
          status: false,
          message: 'Invalid OTP',
        };
      }
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  async verifyRiderOTP(data: autheoObj) {
    try {
      const rider = await this.riderConnection.findOne({
        where: { email: data.email },
      });
      if (rider && rider.otp_token === data.otp) {
        return {
          status: true,
          message: 'OTP is valid',
        };
      } else {
        return {
          status: false,
          message: 'Invalid OTP',
        };
      }
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  //   generateOtp() {
  //     var digits = '0123456789';
  //     let OTP = '';
  //     for (let i = 0; i < 4; i++) {
  //       OTP += digits[Math.floor(Math.random() * 10)];
  //     }
  //     return OTP;
  //   }

  generateOtp2(secret: string, email: string) {
    const otp = speakeasy.totp({
      secret: secret + email,
      encoding: 'base32',
      step: 600,
      digits: 4,
    });
    return otp;
  }

  generateRandomString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  // verifyOtp(secret: string, enteredOtp: string, email: string): boolean {
  //   const otp = this.generateOtp2(secret, email);
  //   console.log(otp);
  //   return otp === enteredOtp;
  // }

  async extractUserFromToken(token) {
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    return decoded;
  }

  extractTokenFromHeader(request) {
    console.log(request.headers.authorization);
    let token = request.headers.authorization.substring(
      7,
      request.headers.authorization.length,
    );
    // console.log({
    //   data: token,
    // });
    return token;
  }

  async getLoggedInUser(request) {
    let token = await this.extractTokenFromHeader(request);
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    return decoded;
  }

  async sendEmail(to, otp) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chiefspammer@yourgreatdomain.com',
        pass: 'SuperSecretPassword', // naturally, replace both with your real credentials or an application-specific password.
      },
    });
    const mailOptions = {
      from: 'vindication@enron.com',
      to: `${to}`,
      subject: 'Invoices due',
      text: `Your Passcode is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
