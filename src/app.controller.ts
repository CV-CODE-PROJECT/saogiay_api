import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello world')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hello world title' })
  @ApiResponse({ status: 200, description: 'Success!' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
