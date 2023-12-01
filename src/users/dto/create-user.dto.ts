import { OmitType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class CreateUserDto extends OmitType(User, [
  'ref_code',
  'referrals',
  'ref_by',
  'id',
  'otp_token',
  'deletedAt',
  'createdAt',
] as const) {}

export class CreateUserResponseDto {
  error: boolean;

  message: string;

  data?: {};
}
