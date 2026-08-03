import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto } from '../order/dto/order.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  // Безопасный парсинг строки из БД в массив для API
  private parseTaken(taken?: string): string[] {
    if (!taken) return [];
    return taken.split(',').map((s) => s.trim()).filter(Boolean);
  }

  private parseTags(tags?: string): string[] {
    if (!tags) return [];
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  private formatSchedule(schedules: any[]) {
    return (schedules || []).map((s) => ({
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: this.parseTaken(s.taken), // Отдаем массив
    }));
  }

  async getAllFilms() {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags), // Отдаем массив
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: this.formatSchedule(film.schedules),
    }));

    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string) {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    const items = this.formatSchedule(film.schedules);

    return {
      total: items.length,
      items,
    };
  }

  async createOrder(dto: CreateOrderDto) {
    const { tickets } = dto;
    const items = [];

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) throw new NotFoundException('Film not found');

      const session = film.schedules?.find((s) => s.id === ticket.session);
      if (!session) throw new NotFoundException('Session not found');

      const currentTakenArray = this.parseTaken(session.taken);
      const seatStr = `${ticket.row}:${ticket.seat}`;
      
      if (currentTakenArray.includes(seatStr)) {
        throw new BadRequestException(`Seat ${seatStr} already taken`);
      }

      currentTakenArray.push(seatStr);

      session.taken = currentTakenArray.join(',');
      
      await this.filmsRepository.save(film);

      items.push({
        film: ticket.film,
        session: ticket.session,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      });
    }

    return {
      total: items.length,
      items,
    };
  }

  async bookTickets(
    filmId: string,
    sessionId: string,
    tickets: { row: number; seat: number }[],
  ) {
    const film = await this.filmsRepository.findById(filmId);
    if (!film) throw new NotFoundException('Film not found');

    const session = film.schedules?.find((s) => s.id === sessionId);
    if (!session) throw new NotFoundException('Session not found');

    const currentTakenArray = this.parseTaken(session.taken);
    const requestedSeats = tickets.map((t) => `${t.row}:${t.seat}`);
    const alreadyTaken = requestedSeats.filter((seat) => currentTakenArray.includes(seat));

    if (alreadyTaken.length > 0) {
      throw new BadRequestException(`Seats already taken: ${alreadyTaken.join(', ')}`);
    }

    const newTaken = [...currentTakenArray, ...requestedSeats];
    session.taken = newTaken.join(',');
    await this.filmsRepository.save(film);

    return session;
  }
}