import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      ttl: +process.env.REDIS_CACHE_TTL,
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
