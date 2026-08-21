import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @Post('')
  createOrder(@Body() dto: any) {
    return this.orderService.createOrder(dto);
  }
}
