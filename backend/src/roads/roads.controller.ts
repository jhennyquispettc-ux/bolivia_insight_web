import { Controller, Get } from '@nestjs/common';
import { RoadsService, RoadsStatus } from './roads.service';

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  // Always 200. The envelope says whether real data was obtained,
  // so the client never has to guess and never fabricates a road state.
  @Get('status')
  getStatus(): Promise<RoadsStatus> {
    return this.roadsService.getStatus();
  }
}
