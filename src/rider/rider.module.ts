import { Module, forwardRef } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Rider } from './entity/rider.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Order } from 'src/orders/entity/orders.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entity/user.entity';

@Module({
  controllers: [RiderController],
  providers: [RiderService],
  imports: [TypeOrmModule.forFeature([Rider, Order, User]), AuthModule, forwardRef(() => OrdersModule), forwardRef(() => UsersModule)],
  exports: [RiderService],
})
export class RiderModule { }

