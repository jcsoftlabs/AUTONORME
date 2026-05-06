import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('featured-models')
  async getFeaturedModels() {
    const models = await this.contentService.getFeaturedModels();
    return {
      success: true,
      data: models,
    };
  }
}
