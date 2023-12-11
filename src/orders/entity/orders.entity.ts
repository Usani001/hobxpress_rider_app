import { Rider } from 'src/rider/entity/rider.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum orderType {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column({ default: '' })
  pickup_add: string;

  @Column({ default: null })
  pickup_schedule_date?: string;

  @Column({ default: null })
  pickup_schedule_time?: string;

  @Column({ default: '' })
  delivery_add: string;

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

  @Column('double precision', { nullable: true })
  latitude: number;

  @Column('double precision', { nullable: true })
  longitude: number;



  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Rider, (rider) => rider.order)
  rider: Rider;
}
