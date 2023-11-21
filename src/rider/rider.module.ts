import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { RiderController } from './rider/rider.controller';
=======
>>>>>>> Dev-Branch
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';

@Module({
  controllers: [RiderController],
<<<<<<< HEAD
  providers: [RiderService]
})
export class RiderModule {}
=======
  providers: [RiderService],
  imports: []
})
export class RiderModule { }
>>>>>>> Dev-Branch
