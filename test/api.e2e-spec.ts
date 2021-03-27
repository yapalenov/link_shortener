import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ApiModule } from '../src/api.module';
import { LinkDto } from '../src/link/link.controller';
import { nanoid } from 'nanoid';

describe('E2E api testing', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testApiModule: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = testApiModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async (done) => {
    await app.close();
  });

  const getRandomUrlBody = (): LinkDto => ({
    url: 'https://google.com/' + nanoid(6),
  });

  describe('/ (POST)', () => {
    it('Should return 400 status for incorrect body', async (done) => {
      try {
        request(app.getHttpServer()).post('/').expect(400);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Should return a link', async (done) => {
      try {
        request(app.getHttpServer())
          .post('/')
          .send(getRandomUrlBody())
          .expect(201);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Should return the same result for the same link', async (done) => {
      const body = getRandomUrlBody();
      const getRequest = async () =>
        await request(app.getHttpServer())
          .post('/')
          .send(body)
          .expect(201)
          .then((response) => {
            expect(response?.text).toBeDefined();
            return response?.text;
          });

      try {
        const firstResult = await getRequest();
        const secondResult = await getRequest();
        expect(firstResult).toEqual(secondResult);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('/ (GET)', () => {
    it('Should return 404 status for non-saved link', async (done) => {
      try {
        await request(app.getHttpServer())
          .get('/' + nanoid(6))
          .expect(404);
        done();
      } catch (e) {
        done(e);
      }
    });

    const body = getRandomUrlBody();

    it('Should return 302 status for saved link', async (done) => {
      try {
        const token = await request(app.getHttpServer())
          .post('/')
          .send(body)
          .expect(201)
          .then((response) => {
            expect(response?.text).toBeDefined();
            return response?.text?.split('/').pop();
          });

        await request(app.getHttpServer())
          .get('/' + token)
          .expect(302);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
