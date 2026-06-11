import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
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

  @Get('schedule-blocks')
  getScheduleBlocks() {
    return this.adminService.getScheduleBlocks();
  }

  @Post('schedule-blocks')
  createScheduleBlock(@Body() body: any) {
    return this.adminService.createScheduleBlock(body);
  }

  @Delete('schedule-blocks/:id')
  deleteScheduleBlock(@Param('id') id: string) {
    return this.adminService.deleteScheduleBlock(parseInt(id, 10));
  }
}
