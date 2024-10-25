import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

describe('AppController', () => {
  let progressController: ProgressController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [ProgressService],
    }).compile();

    progressController = app.get<ProgressController>(ProgressController);
  });

  describe('root', () => {
    it('should return "Here is the progress!"', () => {
      expect(progressController.getProgress()).toBe('Here is the progress!');
    });
  });
});
