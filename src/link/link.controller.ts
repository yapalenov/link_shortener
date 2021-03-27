import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Redirect,
  UseInterceptors,
} from '@nestjs/common';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { LinkService } from './link.service';

export class LinkDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

@Controller('/')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get(':token')
  @Redirect()
  @UseInterceptors(CacheInterceptor)
  async redirect(@Param('token') token: string) {
    const link = await this.linkService.getByToken(token);

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    const { id, url } = link;

    await this.linkService.increaseVisitsCount(id);

    return { url };
  }

  @Post()
  async generate(@Body() linkBody: LinkDto) {
    const { url } = linkBody;
    return this.linkService.generate(url);
  }
}
