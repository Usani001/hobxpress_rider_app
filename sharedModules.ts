import { OrdersModule } from 'src/orders/orders.module';
import { RiderModule } from 'src/rider/rider.module';
import { UsersModule } from 'src/users/users.module';

export const sharedModules = [UsersModule, OrdersModule, RiderModule];
