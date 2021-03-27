import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { LinkModule } from './link/link.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionsFilter } from './apiExeptionFilter';

@Module({
  imports: [SystemModule, LinkModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionsFilter,
    },
  ],
})
export class ApiModule {}
