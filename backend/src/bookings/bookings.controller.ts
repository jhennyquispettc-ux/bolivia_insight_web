import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // NOTE: Bookings are NOT created here directly anymore. A booking can only be
  // created through a verified PayPal capture (see PaymentsController), so it is
  // impossible to schedule a session without paying first.

  @Get('mine')
  async findMine(@Req() req) {
    return this.bookingsService.findByUser(req.user.sub);
  }

  @Get('availability')
  async getAvailability() {
    return this.bookingsService.getAvailability();
  }
}
