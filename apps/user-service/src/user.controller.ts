import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): string {
    this.logger.log('Fetching all users');
    const users = this.userService.getUsers();
    this.logger.log(`Fetched users: ${users}`);
    return users;
  }
}
