import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RiderModule } from 'src/rider/rider.module';
import { Rider } from 'src/rider/entity/rider.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Order, Rider]), AuthModule, forwardRef(() => RiderModule)],
  exports: [OrdersService],
})
export class OrdersModule { }
