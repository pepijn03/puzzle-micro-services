import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
//import { User } from '../objects/user.interface';
//import { Friends } from '../objects/friends.interface';
import { UserEntity } from '../objects/user.entity';
import { FriendEntity } from '../objects/friend.entity';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<UserEntity[]> {
    this.logger.log('Fetching all users');
    const users = this.userService.getUsers();
    this.logger.log(`Fetched users: ${users}`);
    return users;
  }

  @Get('/:id')
  GetUserById(@Param('id') id : number ): Promise<UserEntity> {
    this.logger.log('Fetching user by id');
    const user = this.userService.getUserById(id);
    this.logger.log(`Fetched user: ${user}`);
    return user;
  }

  @Get('/friends/:id')
  GetFriends(@Param('id') id : number ): Promise<UserEntity[]> {
    this.logger.log('Fetching all friends of user');
    const friends = this.userService.getFriends(id);
    this.logger.log(`Fetched friends of user: ${friends}`);
    return friends;
  }

  @Post('/add')
  AddUser(@Body() user : UserEntity): void {
    this.logger.log('Adding a new user');
    this.userService.addUser(user);
    this.logger.log(`Added user`);
  }

  @Post('/addFriend')
  AddFriend(@Body() friends : FriendEntity): void {
    this.logger.log('Adding a new friend');
    this.userService.addFriend(friends.userId, friends.friendId);
    this.logger.log(`Added friend`);
    }
}
