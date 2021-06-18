import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@link http://localhost:3000/
  @Get()
  GetRouter(): string {
    return this.appService.GetRouter() ;
  }
  
}
