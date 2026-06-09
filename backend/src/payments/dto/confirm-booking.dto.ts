import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ALLOWED_SLOTS } from '../../bookings/bookings.service';

/**
 * Body sent when capturing a PayPal order. Carries the booking details + the
 * mandatory traveler brief. Everything is validated before we touch PayPal.
 */
export class ConfirmBookingDto {
  @IsDateString()
  date: string; // ISO date, e.g. "2026-06-20"

  @IsIn(ALLOWED_SLOTS)
  timeSlot: string; // e.g. "17:00" (Bolivia time)

  @IsIn([15, 30])
  durationMin: number;

  // ── Mandatory trip brief (so the local expert can prepare) ──
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  briefDates: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  briefRoute: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  briefQuestions: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  briefLocation: string;

  // Google OAuth access token, used to create the Calendar event.
  @IsString()
  @IsNotEmpty()
  googleAccessToken: string;
}
