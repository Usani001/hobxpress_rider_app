import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum orderType {
  ACTIVE = 'ACTIVE',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column({ default: '', nullable: true })
  rider_id: string;

  @Column({ type: 'text', array: true, default: [] })
  images?: string[];

  @Column({ default: '' })
  pickup_add: string;

  @Column({ default: '' })
  delivery_add: string;

  @Column({ default: '' })
  geo_pickup: string;

  @Column({ default: '' })
  geo_delivery: string;

  @Column({
    type: 'text',
    default: '',
  })
  order_cost: string;

  @Column({
    type: 'text',
    default: '',
  })
  distance: string;

  @Column({
    type: 'text',
    default: '',
  })
  riderDistance: string;

  @Column({ type: 'text', default: '' })
  user_phone_no: string;

  @Column({
    type: 'text',
    default: '',
    nullable: true,
  })
  rider_phone_no: string;

  @Column({ default: null })
  pickup_schedule_date?: string;

  @Column({ default: null })
  pickup_schedule_time?: string;

  @Column({ default: '' })
  recieverName: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ default: '' })
  recieverEmail?: string;

  @Column({ default: '' })
  notes?: string;

  @Column({ default: '' })
  itemName: string;

  @Column({ default: '' })
  itemSize: string;

  @Column({ default: '' })
  comments?: string;

  @Column({ default: 0 })
  ratings?: number;

  @Column({
    default: false,
  })
  rated: boolean;

  @Column({ default: '' })
  itemWeight: string;

  @Column({ default: '' })
  itemDescription: string;

  @Column({ default: '' })
  delivery_description?: string;

  @Column({ default: orderType.ACTIVE })
  type: orderType;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @Column('double precision', { default: 0 })
  pickupLatitude: number;

  @Column('double precision', { default: 0 })
  pickupLongitude: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
