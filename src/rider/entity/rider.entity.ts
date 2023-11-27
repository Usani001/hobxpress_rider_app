import { Order } from "src/orders/entity/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


import {
    DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const generatedUuid = uuidv4();
const code = generatedUuid.slice(0, 5);


@Entity()
export class Rider {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    password: string;

    @Column({ default: '', unique: true })
    email: string;

    @Column({ default: '' })
    first_name: string;

    @Column({ default: '' })
    last_name: string;

    @Column({ default: 0 })
    otp_token: number;

    @Column({ default: '', unique: true })
    ref_code: string = code;

    @Column({ default: '' })
    ref_by: string;

    @Column({ type: 'text', array: true, default: [] })
    referrals: string[];

    @Column({ type: 'text', array: true, default: [] })
    notifications: string[];

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;



    @OneToMany(() => Order, order => order.rider)
    order: Order[];


}