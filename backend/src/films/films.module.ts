import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsController } from './films.controller';
import { OrderController } from '../order/order.controller';
import { FilmsService } from './films.service';
import { FilmEntity } from './entities/film.entity';
import { FilmsRepository } from '../repository/films.repository';
import { ScheduleEntity } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  controllers: [FilmsController, OrderController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsService, FilmsRepository],
})
export class FilmsModule {}