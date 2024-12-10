import { Test, TestingModule } from '@nestjs/testing';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

describe('ResultServiceController', () => {
  let resultServiceController: ResultController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResultController],
      providers: [ResultService],
    }).compile();

    resultServiceController = app.get<ResultController>(ResultController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(resultServiceController.getHello()).toBe('Hello World!');
    });
  });
});
