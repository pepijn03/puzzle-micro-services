import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../objects/user.entity';
import { FriendEntity } from '../objects/friend.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // Mock data
  const mockUser1: UserEntity = {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    friends: []
  };

  const mockUser2: UserEntity = {
    id: 2,
    username: 'janedoe',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    friends: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            getFriends: jest.fn(),
            addUser: jest.fn(),
            addFriend: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      jest.spyOn(userService, 'getUsers').mockResolvedValue([mockUser1, mockUser2]);

      const result = await userController.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('johndoe');
      expect(userService.getUsers).toHaveBeenCalled();
    });
  });

  describe('GetUserById', () => {
    it('should return a user when a valid ID is provided', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser1);

      const result = await userController.GetUserById(1);

      expect(result).toEqual(mockUser1);
      expect(userService.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('GetFriends', () => {
    it('should return friends for a given user ID', async () => {
      jest.spyOn(userService, 'getFriends').mockResolvedValue([mockUser2]);

      const result = await userController.GetFriends(1);

      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('janedoe');
      expect(userService.getFriends).toHaveBeenCalledWith(1);
    });
  });

  describe('AddUser', () => {
    it('should add a new user', async () => {
      const spyAddUser = jest.spyOn(userService, 'addUser').mockResolvedValue(mockUser1);

      userController.AddUser(mockUser1);

      expect(spyAddUser).toHaveBeenCalledWith(mockUser1);
    });
  });

  describe('AddFriend', () => {
    it('should add a friendship between two users', async () => {
      const mockFriendEntity: FriendEntity = {
        id: 1,
        userId: 1,
        friendId: 2,
        user: mockUser1
      };

      const spyAddFriend = jest.spyOn(userService, 'addFriend').mockResolvedValue(mockFriendEntity);

      userController.AddFriend(mockFriendEntity);

      expect(spyAddFriend).toHaveBeenCalledWith(mockFriendEntity.userId, mockFriendEntity.friendId);
    });
  });
});