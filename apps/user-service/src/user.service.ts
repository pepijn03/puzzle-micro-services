import { Injectable } from '@nestjs/common';
import { User } from '../objects/user.interface';

@Injectable()
export class UserService {
  getUsers(): string {
    return 'Here are the users!';
  }

  getUserById(id : number): string {
    return 'Here is the user!';
  }

  getFriends(id : number): string {
    return 'Here are the friends!';
  }

  addUser(user : User): void {
    user.createdAt = new Date();
    user.updatedAt = new Date();

    return;
  }

  addFriend(userid1 : number, userid2 : number): void {

    return;
  }
}
