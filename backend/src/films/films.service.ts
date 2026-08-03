import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms() {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: Array.isArray(film.tags) ? film.tags : film.tags ? [film.tags] : [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedules || [],
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

    return {
      total: film.schedules ? film.schedules.length : 0,
      items: film.schedules || [],
    };
  }

  async createOrder(dto: any) {
    const { tickets } = dto;
    const items = [];

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) throw new NotFoundException('Film not found');

      const session = film.schedules?.find((s) => s.id === ticket.session);
      if (!session) throw new NotFoundException('Session not found');

      const currentTakenArray = session.taken
        ? session.taken.split(',').filter(Boolean)
        : [];

      const seatStr = `${ticket.row}:${ticket.seat}`;
      if (currentTakenArray.includes(seatStr)) {
        throw new BadRequestException(`Seat ${seatStr} already taken`);
      }

      session.taken = [...currentTakenArray, seatStr].join(',');
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

    const currentTakenArray = session.taken
      ? session.taken.split(',').filter(Boolean)
      : [];
    const requestedSeats = tickets.map((t) => `${t.row}:${t.seat}`);
    const alreadyTaken = requestedSeats.filter((seat) =>
      currentTakenArray.includes(seat),
    );

    if (alreadyTaken.length > 0) {
      throw new BadRequestException(
        `Seats already taken: ${alreadyTaken.join(', ')}`,
      );
    }

    session.taken = [...currentTakenArray, ...requestedSeats].join(',');
    await this.filmsRepository.save(film);

    return session;
  }
}
