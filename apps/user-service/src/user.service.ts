import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../objects/user.entity';
import { FriendEntity } from '../objects/friend.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly mbusClient: ClientProxy,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity)
    private friendRepository: Repository<FriendEntity>
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'username', 'email', 'firstName', 'lastName', 'createdAt']
      });
      this.logger.log(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Failed to retrieve users', error.stack);
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ 
        where: { id },
        select: ['id', 'username', 'email', 'firstName', 'lastName', 'createdAt']
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to retrieve user with ID ${id}`, error.stack);
      throw error;
    }
  }

  async getFriends(userId: number): Promise<UserEntity[]> {
    try {
      // Find friend relationships
      const friendships = await this.friendRepository.find({
        where: { userId },
        relations: ['user']
      });

      // Extract friend details
      const friends = friendships.map(friendship => friendship.user);
      
      this.logger.log(`Retrieved ${friends.length} friends for user ${userId}`);
      return friends;
    } catch (error) {
      this.logger.error(`Failed to retrieve friends for user ${userId}`, error.stack);
      throw error;
    }
  }

  async addUser(userData: UserEntity): Promise<UserEntity> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create and save new user
      const newUser = this.userRepository.create({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedUser = await this.userRepository.save(newUser);
      
      this.logger.log(`Added new user: ${savedUser.username}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to add user', error.stack);
      throw error;
    }
  }

  async addFriend(userId1: number, userId2: number): Promise<FriendEntity> {
    try {
      // Validate both users exist
      const user1 = await this.userRepository.findOne({ where: { id: userId1 } });
      const user2 = await this.userRepository.findOne({ where: { id: userId2 } });

      if (!user1 || !user2) {
        throw new NotFoundException('One or both users not found');
      }

      // Check if friendship already exists
      const existingFriendship = await this.friendRepository.findOne({
        where: [
          { userId: userId1, friendId: userId2 },
          { userId: userId2, friendId: userId1 }
        ]
      });

      if (existingFriendship) {
        throw new Error('Friendship already exists');
      }

      // Create friendship in both directions
      const friendship1 = this.friendRepository.create({
        userId: userId1,
        friendId: userId2
      });

      const friendship2 = this.friendRepository.create({
        userId: userId2,
        friendId: userId1
      });

      // Save both friendships
      await this.friendRepository.save([friendship1, friendship2]);
      
      this.logger.log(`Added friendship between users ${userId1} and ${userId2}`);
      return friendship1;
    } catch (error) {
      this.logger.error(`Failed to add friendship between users ${userId1} and ${userId2}`, error.stack);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.userRepository.delete(id);
      this.logger.log(`Deleted user with ID ${id}`);
      this.mbusClient.emit('UserRemoved', { id });
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}`, error.stack);
      throw error;
    }
  }
}