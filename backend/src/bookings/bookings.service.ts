import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

// Slots offered by the calendar picker (Bolivia time). Kept in sync with the
// frontend CalendarPicker and validated server-side so a tampered request can't
// book an arbitrary time.
export const ALLOWED_SLOTS = ['09:00', '10:30', '14:00', '15:30', '17:00'];

export interface CreateBookingParams {
  userId: number;
  userEmail: string;
  userName: string;
  googleAccessToken: string;
  date: string;
  timeSlot: string;
  durationMin: number;
  amount: number;
  currency: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  briefDates: string;
  briefRoute: string;
  briefQuestions: string;
  briefLocation: string;
}

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ── Google Calendar ─────────────────────────────────────────────────────────
  private async createCalendarEvent(
    googleAccessToken: string,
    date: Date,
    timeSlot: string,
    topic: string,
    userEmail: string,
    userName: string,
    briefText: string,
  ): Promise<{ id: string; link: string }> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    auth.setCredentials({ access_token: googleAccessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    // date is a UTC midnight Date object (e.g. 2026-05-11T00:00:00Z)
    const dateStr = date.toISOString().substring(0, 10);
    const [y, m, d] = dateStr.split('-');
    
    // timeSlot is e.g. "17:00"
    const [hStr, mStr] = timeSlot.split(':');
    
    // Explicitly construct the ISO 8601 string for Bolivia time (-04:00)
    const startDateTime = `${dateStr}T${hStr}:${mStr}:00-04:00`;
    
    // Calculate end time (+1 hour) by using UTC math to avoid Node timezone shifts
    const endUtc = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hStr) + 1, Number(mStr)));
    const endY = endUtc.getUTCFullYear();
    const endM = String(endUtc.getUTCMonth() + 1).padStart(2, '0');
    const endD = String(endUtc.getUTCDate()).padStart(2, '0');
    const endH = String(endUtc.getUTCHours()).padStart(2, '0');
    const endMin = String(endUtc.getUTCMinutes()).padStart(2, '0');
    const endDateTime = `${endY}-${endM}-${endD}T${endH}:${endMin}:00-04:00`;

    const event = {
      summary: `Bolivia Insight — ${topic}`,
      description:
        `Session booked via Bolivia Insight.\nTopic: ${topic}\nBooked by: ${userName} (${userEmail})\n\n` +
        `── Traveler brief (prepare for this) ──\n${briefText}`,
      start: { dateTime: startDateTime, timeZone: 'America/La_Paz' },
      end:   { dateTime: endDateTime,   timeZone: 'America/La_Paz' },
      conferenceData: {
        createRequest: {
          requestId: `boliviainsight-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email',  minutes: 60 },
          { method: 'popup',  minutes: 15 },
        ],
      },
    };

    const res = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    });

    return {
      id:   res.data.id ?? '',
      link: res.data.hangoutLink || res.data.htmlLink || '',
    };
  }

  // ── Email ────────────────────────────────────────────────────────────────────
  private async sendConfirmationEmail(
    to: string,
    userName: string,
    date: Date,
    timeSlot: string,
    topic: string,
    calendarLink: string,
    brief: {
      dates: string;
      route: string;
      questions: string;
      location: string;
    },
  ) {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#0f172a;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">✅ Session confirmed</h1>
          <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:14px">Bolivia Insight · Local Expert Session</p>
        </div>
        <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:16px">Hi <strong>${userName}</strong>,</p>
          <p>Your session has been booked and added to your Google Calendar.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <tr><td style="padding:10px;background:#f8fafc;border-radius:8px;font-weight:700;width:120px">Date</td>
                <td style="padding:10px">${dateStr}</td></tr>
            <tr><td style="padding:10px;font-weight:700">Time</td>
                <td style="padding:10px">${timeSlot} (Bolivia Time)</td></tr>
            <tr><td style="padding:10px;background:#f8fafc;border-radius:8px;font-weight:700">Topic</td>
                <td style="padding:10px;background:#f8fafc">${topic}</td></tr>
          </table>
          ${calendarLink ? `<a href="${calendarLink}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px">View in Google Calendar →</a>` : ''}
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <h3 style="font-size:15px;margin:0 0 10px">📋 Your trip brief</h3>
          <p style="font-size:12px;color:#64748b;margin:0 0 14px">We'll review this before the call so the expert comes prepared.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 10px;background:#f8fafc;font-weight:700;width:140px;vertical-align:top">Travel dates</td>
                <td style="padding:8px 10px">${this.escapeHtml(brief.dates)}</td></tr>
            <tr><td style="padding:8px 10px;font-weight:700;vertical-align:top">Rough route</td>
                <td style="padding:8px 10px">${this.escapeHtml(brief.route)}</td></tr>
            <tr><td style="padding:8px 10px;background:#f8fafc;font-weight:700;vertical-align:top">Top questions</td>
                <td style="padding:8px 10px;background:#f8fafc;white-space:pre-line">${this.escapeHtml(brief.questions)}</td></tr>
            <tr><td style="padding:8px 10px;font-weight:700;vertical-align:top">Currently in</td>
                <td style="padding:8px 10px">${this.escapeHtml(brief.location)}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <p style="font-size:12px;color:#94a3b8">Bolivia Insight · Real-time travel intelligence for Bolivia</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from:    `"Bolivia Insight" <${process.env.SMTP_USER}>`,
      to,
      subject: `✅ Session confirmed — ${topic} · ${dateStr}`,
      html,
    });
  }

  private escapeHtml(s: string): string {
    return (s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ── Public methods ───────────────────────────────────────────────────────────
  async create(params: CreateBookingParams) {
    const date = new Date(params.date);
    if (isNaN(date.getTime())) throw new BadRequestException('Invalid date');

    // The slot must be one we actually offer (defense against tampered requests).
    if (!ALLOWED_SLOTS.includes(params.timeSlot)) {
      throw new BadRequestException('Invalid time slot');
    }

    // The booking instant (Bolivia time, UTC−4) must be in the future.
    const [h, m] = params.timeSlot.split(':').map(Number);
    const slotInstant = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h + 4, m),
    );
    if (slotInstant.getTime() <= Date.now()) {
      throw new BadRequestException('That slot is in the past');
    }

    // No double-booking: that date + slot must not already be taken.
    const clash = await this.prisma.booking.findFirst({
      where: {
        date,
        timeSlot: params.timeSlot,
        status: { in: ['pending', 'confirmed'] },
      },
    });
    if (clash) {
      throw new ConflictException('That time slot is no longer available');
    }

    const topic = `${params.durationMin}-min Trip Review`;
    const brief = {
      dates: params.briefDates,
      route: params.briefRoute,
      questions: params.briefQuestions,
      location: params.briefLocation,
    };
    const briefText =
      `Travel dates: ${brief.dates}\n` +
      `Rough route: ${brief.route}\n` +
      `Top questions:\n${brief.questions}\n` +
      `Currently in: ${brief.location}`;

    let calendarId: string | null = null;
    let calendarLink: string | null = null;

    // Try to create GCal event (non-fatal if it fails — token may have expired)
    try {
      const cal = await this.createCalendarEvent(
        params.googleAccessToken,
        date,
        params.timeSlot,
        topic,
        params.userEmail,
        params.userName,
        briefText,
      );
      calendarId = cal.id;
      calendarLink = cal.link;
    } catch (err) {
      console.warn('Google Calendar create failed (token expired?):', err.message);
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId: params.userId,
        date,
        timeSlot: params.timeSlot,
        topic,
        notes: briefText,
        durationMin: params.durationMin,
        amount: params.amount,
        currency: params.currency,
        paypalOrderId: params.paypalOrderId,
        paypalCaptureId: params.paypalCaptureId,
        briefDates: brief.dates,
        briefRoute: brief.route,
        briefQuestions: brief.questions,
        briefLocation: brief.location,
        calendarId,
        calendarLink,
      },
    });

    // Send email (non-fatal)
    try {
      await this.sendConfirmationEmail(
        params.userEmail,
        params.userName,
        date,
        params.timeSlot,
        topic,
        calendarLink ?? '',
        brief,
      );
    } catch (err) {
      console.warn('Email send failed:', err.message);
    }

    return booking;
  }

  async findByUser(userId: number) {
    return this.prisma.booking.findMany({
      where:   { userId },
      orderBy: { date: 'desc' },
    });
  }

  async cancel(bookingId: number, userId: number) {
    return this.prisma.booking.updateMany({
      where:  { id: bookingId, userId },
      data:   { status: 'cancelled' },
    });
  }

  async getAvailability() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.booking.findMany({
      where: { date: { gte: today }, status: { in: ['pending', 'confirmed'] } },
      select: { date: true, timeSlot: true },
    });
  }
}
