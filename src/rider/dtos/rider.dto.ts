import { OmitType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Rider } from "../entity/rider.entity";


export class RiderDto extends OmitType(Rider, [
    'ref_code',
    'referrals',
    'ref_by',
    'id',
    'otp_token',
    'deletedAt',
] as const) {


}


export class CreateUserResponseDto {
    error: boolean;

    message: string;

    data?: {};
}



