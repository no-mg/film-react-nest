import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  daytime: string;

  @Column({ type: 'varchar' })
  hall: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'text' })
  taken: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;
}
