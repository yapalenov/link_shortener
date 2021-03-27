import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../database/entities/link/link.entity';
import { RedisCacheModule } from '../cache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), RedisCacheModule],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
