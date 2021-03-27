import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '../database/entities/link/link.entity';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid/async';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '../config/constants';

const TOKEN_GENERATION_MAX_ATTEMPT = +process.env.TOKEN_GENERATION_MAX_ATTEMPT;
const LINK_TOKEN_LENGTH = +process.env.LINK_TOKEN_LENGTH;
const SERVICE_ORIGIN =
  process.env.SERVICE_ORIGIN || `http://localhost:${process.env.PORT}`;

@Injectable()
export class LinkService {
  private readonly logger = new Logger(LinkService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async generate(url: string): Promise<string> {
    let attempt = 0;

    while (attempt++ < TOKEN_GENERATION_MAX_ATTEMPT) {
      const token = await nanoid(LINK_TOKEN_LENGTH);
      try {
        const result = await this.linkRepository
          .createQueryBuilder()
          .insert()
          .values({ url, token })
          .onConflict(`("url") DO UPDATE SET url = excluded.url`)
          .returning(['token'])
          .execute();
        return `${SERVICE_ORIGIN}/${result.raw[0].token}`;
      } catch (e) {
        if (e && e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
          this.logger.warn(
            `Duplicate token when generating | ${JSON.stringify({
              attempt,
              token,
            })}`,
          );
        } else {
          throw new InternalServerErrorException(e);
        }
      }
    }
    throw new InternalServerErrorException('Too much tokens generated');
  }

  async getByToken(token: string): Promise<Link | undefined> {
    return await this.linkRepository.findOne({ token });
  }

  async increaseVisitsCount(id: number): Promise<void> {
    await this.linkRepository
      .createQueryBuilder('link')
      .update()
      .set({ visits_count: () => 'visits_count + 1' })
      .where('link.id = :id', { id })
      .execute();
  }
}
