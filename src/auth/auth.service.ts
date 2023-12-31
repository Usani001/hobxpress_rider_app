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
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
  ) { }


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

        //send otp email.
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


  async extractUserFromToken(token) {
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    return decoded;
  }

  extractTokenFromHeader(request) {
    let token = request.headers.authorization.substring(
      7,
      request.headers.authorization.length
    );
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
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY, // naturally, replace both with your real credentials or an application-specific password.
      },
    });
    const mailOptions = {
      from: 'hobxpress@gmail.com',
      to: `${to}`,
      subject: 'DO NOT DISCLOSE YOUR CODE.',
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
