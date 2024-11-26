import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [PrometheusModule.register()],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressServiceModule {}
