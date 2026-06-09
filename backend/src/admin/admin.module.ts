import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // JwtModule is global, used by AdminGuard
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
