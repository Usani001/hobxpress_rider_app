import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from 'src/rider/entity/rider.entity';
import { Order } from 'src/orders/entity/orders.entity';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User, Rider, Order]),
    JwtModule.register({
      global: true,
      secret: process.env.DEFAULT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AuthModule { }
