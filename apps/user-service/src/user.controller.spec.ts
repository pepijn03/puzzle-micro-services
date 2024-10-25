import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserServiceController', () => {
  let userServiceController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userServiceController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Here are the users!"', () => {
      expect(userServiceController.getUsers()).toBe('Here are the users!');
    });
  });
});
