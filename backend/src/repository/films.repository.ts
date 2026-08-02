import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }
}