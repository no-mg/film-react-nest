import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async getAllFilms() {
    const films = await this.filmModel.find().exec();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string) {
    const film = await this.filmModel.findOne({ id }).exec();

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }

  async bookTickets(
    filmId: string,
    sessionId: string,
    tickets: { row: number; seat: number }[],
  ) {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const requestedSeats = tickets.map((t) => `${t.row}:${t.seat}`);

    const alreadyTaken = requestedSeats.filter((seat) =>
      session.taken.includes(seat),
    );

    if (alreadyTaken.length > 0) {
      throw new BadRequestException(
        `Seats already taken: ${alreadyTaken.join(', ')}`,
      );
    }

    session.taken.push(...requestedSeats);

    film.markModified('schedule');
    await film.save();

    return session;
  }
}
