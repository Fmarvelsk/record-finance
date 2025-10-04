import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/api-key.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(ApiKeyGuard)
  @Get('/users')
  getUsers() {
    return this.appService.getUsers();
  }
  // @UseGuards(ApiKeyGuard)
  @Get('/addresses')
  getAddresses() {
    return this.appService.getAddresses();
  }

  @Get('/test-sdk')
  testSdk() {
    return this.appService.testSdk();
  }
}
