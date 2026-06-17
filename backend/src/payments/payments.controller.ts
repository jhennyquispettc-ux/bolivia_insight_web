import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly bookingsService: BookingsService,
  ) {}

  /**
   * Public config for the browser PayPal SDK. The client-id is meant to be
   * public; the secret never leaves the backend. No auth needed.
   */
  @Get('config')
  getConfig() {
    return {
      clientId: this.paymentsService.clientId,
      currency: this.paymentsService.currency,
      configured: this.paymentsService.isConfigured(),
    };
  }

  /** Create a PayPal order. Amount is derived server-side from the duration. */
  @Post('orders')
  @UseGuards(AuthGuard)
  async createOrder(@Body() dto: CreateOrderDto) {
    const amount = this.paymentsService.priceFor(dto.durationMin);
    const order = await this.paymentsService.createOrder(
      amount,
      `Bolivia Insight — ${dto.durationMin}-min expert session`,
    );
    return {
      orderId: order.id,
      amount,
      currency: this.paymentsService.currency,
    };
  }

  /**
   * Capture the order AND create the booking. The booking only exists if the
   * capture is COMPLETED and the captured amount matches the server price.
   */
  @Post('orders/:orderId/capture')
  @UseGuards(AuthGuard)
  async captureOrder(
    @Req() req,
    @Param('orderId') orderId: string,
    @Body() dto: ConfirmBookingDto,
  ) {
    const expected = this.paymentsService.priceFor(dto.durationMin);

    // Ensure the slot is still available BEFORE capturing the user's money.
    // If it's taken, this throws a ConflictException (409) and aborts the capture.
    await this.bookingsService.assertSlotAvailable(dto.date, dto.timeSlot);

    const capture = await this.paymentsService.captureOrder(orderId);

    if (capture.status !== 'COMPLETED') {
      throw new BadRequestException(`El pago no se completó (estado: ${capture.status})`);
    }
    // Cross-check the amount actually charged against our price table.
    if (capture.amount === null || Math.abs(capture.amount - expected) > 0.001) {
      throw new BadRequestException('El monto pagado no coincide con el precio de la sesión');
    }

    const userId = req.user.sub;
    const userEmail = req.user.email;
    const userName = req.user.name || userEmail.split('@')[0];

    const booking = await this.bookingsService.create({
      userId,
      userEmail,
      userName,
      googleAccessToken: dto.googleAccessToken,
      date: dto.date,
      timeSlot: dto.timeSlot,
      durationMin: dto.durationMin,
      amount: expected,
      currency: capture.currency || this.paymentsService.currency,
      paypalOrderId: orderId,
      paypalCaptureId: capture.captureId ?? '',
      briefDates: dto.briefDates,
      briefRoute: dto.briefRoute,
      briefQuestions: dto.briefQuestions,
      briefLocation: dto.briefLocation,
    });

    return { booking, payment: { orderId, captureId: capture.captureId } };
  }
}
