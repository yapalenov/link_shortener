import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LinkController, LinkDto } from './link.controller';
import { LinkService } from './link.service';
import { nanoid } from 'nanoid';
import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';

class LinkServiceMock {
  generate = jest.fn();
  getByToken = jest.fn();
  increaseVisitsCount = jest.fn();
}

describe('LinkController testing', () => {
  let linkController: LinkController;
  let linkService: LinkService;

  const mockToken = nanoid(6).toString();
  const mockOriginalUrl = `${process.env.SERVICE_ORIGIN}/${nanoid(8)}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [
        {
          provide: LinkService,
          useClass: LinkServiceMock,
        },
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    linkController = module.get<LinkController>(LinkController);
    linkService = module.get<LinkService>(LinkService);
  });

  describe('generate', () => {
    it('Should return generated short link', async (done) => {
      const body: LinkDto = {
        url: mockOriginalUrl,
      };

      const expectResult = `${process.env.SERVICE_ORIGIN}/${mockToken}`;

      jest
        .spyOn(linkService, 'generate')
        .mockImplementation(async () => expectResult);

      expect(await linkController.generate(body)).toBe(expectResult);
      expect(linkService.generate).toBeCalledWith(body.url);
      done();
    });
  });

  describe('redirect', () => {
    it('Should return object like { url: string }', async (done) => {
      jest
        .spyOn(linkService, 'getByToken')
        .mockImplementation(async (token) => ({
          id: 1,
          url: mockOriginalUrl,
          token: mockToken,
          visits_count: 0,
          created_at: new Date(),
          updated_at: new Date(),
        }));

      expect(await linkController.redirect(mockToken)).toMatchObject({
        url: mockOriginalUrl,
      });
      expect(linkService.getByToken).toBeCalledWith(mockToken);
      expect(linkService.increaseVisitsCount).toBeCalled();
      done();
    });

    it('Should throw NotFoundException', async (done) => {
      jest
        .spyOn(linkService, 'getByToken')
        .mockImplementation((token) => undefined);

      try {
        await linkController.redirect(mockToken);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      } finally {
        expect(linkService.increaseVisitsCount).not.toBeCalled();
      }
      done();
    });
  });
});
