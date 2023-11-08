import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const generatedUuid = uuidv4();
const code = generatedUuid.slice(0, 5);
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ default: 0 })
  otp_token: number;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '', unique: true })
  email: string;

  @Column({ default: '', unique: true })
  ref_code: string = code;

  @Column({ default: '' })
  ref_by: string;

  @Column({ type: 'text', array: true, default: [] })
  referrals: string[];

  @Column({ type: 'text', array: true, default: [] })
  notifications: string[];
}
