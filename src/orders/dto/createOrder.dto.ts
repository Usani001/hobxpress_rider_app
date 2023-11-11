import { OmitType } from '@nestjs/swagger';
import { Order } from '../entity/orders.entity';

export class CreateOrderDto extends OmitType(Order, [
  'id',
  'type',
  'user_id',
] as const) {}
