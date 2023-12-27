import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Rider } from '../entity/rider.entity';

export class RiderDto extends OmitType(Rider, [
  'id',
  'deletedAt',
] as const) {

  @IsNotEmpty({ message: 'Rider must provide a response' })
  riderResponse: string;

  @IsNotEmpty({ message: 'Please provide an order Id' })
  id: string;
}

export class CreateUserResponseDto {
  error: boolean;

  message: string;

  data?: {};
}
