import '../_bin/_env';
import { Test, TestingModule } from '@nestjs/testing';
import { LinkController, LinkDto } from './link.controller';
import { LinkService } from './link.service';
import { nanoid } from 'nanoid';
import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from '../database/entities/link/link.entity';
import { Repository } from 'typeorm';

class LinkRepositoryMock {
  createQueryBuilder = jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    onConflict: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  });
  findOne = jest.fn();
}

describe('LinkController testing', () => {
  let linkService: LinkService;
  let linkRepository: Repository<Link>;

  const mockToken = nanoid(6).toString();
  const mockOriginalUrl = `${process.env.SERVICE_ORIGIN}/${nanoid(8)}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: getRepositoryToken(Link),
          useClass: LinkRepositoryMock,
        },
      ],
    }).compile();

    linkService = module.get<LinkService>(LinkService);
    linkRepository = module.get<Repository<Link>>(getRepositoryToken(Link));
  });

  describe('generate', () => {
    it('Should return generated short link', async (done) => {
      const expectResult = `${process.env.SERVICE_ORIGIN}/${mockToken}`;

      jest
        .spyOn(linkRepository.createQueryBuilder(), 'execute')
        .mockImplementation(async () => ({ raw: [{ token: mockToken }] }));

      expect(await linkService.generate(mockOriginalUrl)).toBe(expectResult);
      done();
    });
  });

  describe('getByToken', () => {
    it('Should return Link type', async (done) => {
      const expectResult: Link = {
        id: 1,
        url: mockOriginalUrl,
        token: mockToken,
        visits_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(linkRepository, 'findOne')
        .mockImplementation(async () => expectResult);

      expect(await linkService.getByToken(mockToken)).toBe(expectResult);
      done();
    });

    it('Should return undefined', async (done) => {
      jest
        .spyOn(linkRepository, 'findOne')
        .mockImplementation(async () => undefined);

      expect(await linkService.getByToken(mockToken)).toBeUndefined();
      done();
    });
  });

  describe('getByToken', () => {
    it('Should return undefined', async (done) => {
      const mockId = 1;
      expect(await linkService.increaseVisitsCount(mockId)).toBeUndefined();
      done();
    });
  });
});
