import { Controller, Get, Logger } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('/progress')
export class ProgressController {
  private readonly logger = new Logger(ProgressController.name);

  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(): string {
    this.logger.log('Fetching progress');
    const progress = this.progressService.getProgress();
    this.logger.log(`Fetched progress: ${progress}`);
    return progress;
  }
}
