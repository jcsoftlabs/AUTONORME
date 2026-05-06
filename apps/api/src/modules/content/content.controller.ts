import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('featured-models')
  async getFeaturedModels() {
    return this.contentService.getFeaturedModels();
  }
}
