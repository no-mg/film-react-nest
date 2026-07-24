import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FilmsService } from '../films/films.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(orderDto: CreateOrderDto) {
    const tickets = orderDto.tickets;
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      throw new BadRequestException('Tickets are missing or empty');
    }

    const filmId = tickets[0].film;
    const sessionId = tickets[0].session;

    if (!filmId || !sessionId) {
      throw new BadRequestException('Film ID or Session ID is missing');
    }

    await this.filmsService.bookTickets(filmId, sessionId, tickets);

    const items = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
