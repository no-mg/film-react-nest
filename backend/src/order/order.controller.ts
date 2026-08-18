import { Controller, Post, Body } from '@nestjs/common';
import { FilmsService } from '../films/films.service';

@Controller('order')
export class OrderController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post('/')
  @Post('')
  createOrder(@Body() dto: any) {
    return this.filmsService.createOrder(dto);
  }
}