import { Controller, Get } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(): string {
    return this.progressService.getProgress();
  }
}
