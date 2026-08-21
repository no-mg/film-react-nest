import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

describe('FilmsService', () => {
  let service: FilmsService;

  const mockFilmsRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue({}),
  };

  const mockSchedulesRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        FilmsRepository, // <-- Добавьте это
        {
          provide: getRepositoryToken(FilmEntity),
          useValue: mockFilmsRepository,
        },
        {
          provide: getRepositoryToken(ScheduleEntity),
          useValue: mockSchedulesRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
