import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';



@Entity()
export class User {
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

  @Column({ default: '' })
  ref_by: string;

  @Column({ nullable: true, unique: true })
  phone_number: string;

  @Column({ type: 'text', array: true, default: [] })
  referrals: string[];

  @Column({ type: 'json', default: [] })
  notifications: Object[];

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ default: '' })
  ref_code: string;

  @BeforeInsert()
  generateRefCode() {
    // Generate a unique reference code using uuidv4
    this.ref_code = uuidv4().slice(0, 5);
  }
}
