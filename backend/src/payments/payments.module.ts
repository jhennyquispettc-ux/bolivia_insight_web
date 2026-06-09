import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule], // re-uses BookingsService to create the booking after capture
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
