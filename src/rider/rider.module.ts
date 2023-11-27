import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Rider } from './entity/rider.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Order } from 'src/orders/entity/orders.entity';

@Module({
  controllers: [RiderController],
  providers: [RiderService],
  imports: [TypeOrmModule.forFeature([Rider, Order]), AuthModule, OrdersModule],
  exports: [RiderService],
})
export class RiderModule { }

