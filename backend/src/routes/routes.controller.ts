import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import type { CalculateRouteDto } from './dto/calculate-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('pois')
  async listPois(@Query('city') city?: string) {
    return this.routesService.listPois(city ?? 'la-paz');
  }

  @Get('graph')
  async listGraph(@Query('city') city?: string) {
    return this.routesService.listGraph(city ?? 'la-paz');
  }

  @Post('calculate')
  async calculate(@Body() body: CalculateRouteDto) {
    return this.routesService.calculate(body);
  }
}
