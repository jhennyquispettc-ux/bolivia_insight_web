import { Injectable } from '@nestjs/common';
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
}
