import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /** All meetings (bookings) with the traveler's basic info, oldest first. */
  async findAllMeetings() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true, picture: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getScheduleBlocks() {
    return this.prisma.scheduleBlock.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async createScheduleBlock(data: { date: string, timeSlot?: string | null, reason?: string | null }) {
    const dateObj = new Date(data.date);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        date: dateObj,
        status: { in: ['pending', 'confirmed'] },
        ...(data.timeSlot ? { timeSlot: data.timeSlot } : {})
      }
    });

    if (existingBookings.length > 0) {
      throw new ConflictException(`No se puede realizar el bloqueo porque ya hay una cita agendada para ${data.timeSlot || 'este día'}. Por favor, modifica o acorta el periodo de bloqueo.`);
    }
    return this.prisma.scheduleBlock.create({
      data: {
        date: dateObj,
        timeSlot: data.timeSlot || null,
        reason: data.reason || null,
      }
    });
  }

  async deleteScheduleBlock(id: number) {
    return this.prisma.scheduleBlock.delete({
      where: { id }
    });
  }
}
