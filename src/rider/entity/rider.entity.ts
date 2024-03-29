import { Order } from 'src/orders/entity/orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DeleteDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const generatedUuid = uuidv4();
const code = generatedUuid.slice(0, 5);


@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  password: string;

  // @Column({ default: '', unique: false })
  // email: string;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;


  @Column({ type: 'json', default: [] })
  notifications: Object[];

  @Column({ nullable: true, unique: true })
  phone_number: string;

  @Column({
    type: 'json',
    default: [],
  })
  acceptedOrders: Order[];

  @Column({
    type: 'json',
    default: [],
  })
  completedOrders: Order[];


  @Column('double precision', {
    nullable: true
  })
  latitude: number;

  @Column('double precision', {
    nullable: true
  })
  longitude: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;


  @Column({
    default: ''
  })

  reg_code: string;

  @Column({ default: '' })
  riders_company: string;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 1,
    default: 0
  })

  riderRatings?: number;

  @Column({
    default: 0
  })

  totalRatings: number;


  @Column({
    default: 0
  })

  ratedOrder: number;
}
