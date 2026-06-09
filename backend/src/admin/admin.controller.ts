import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** Lets the admin web confirm the logged-in user is authorized (200 vs 403). */
  @Get('check')
  check(@Req() req) {
    return { isAdmin: true, email: req.user.email };
  }

  /** Full list of meetings for the admin dashboard. */
  @Get('meetings')
  meetings() {
    return this.adminService.findAllMeetings();
  }
}
