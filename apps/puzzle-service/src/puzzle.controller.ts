import { Controller, Get, Param, Post, Body, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PuzzleService } from './puzzle.service';
import { RabbitMQProducerService } from './producer.service';
import { Puzzle } from '../objects/puzzle.interface';

@Controller()
export class PuzzleController {
  constructor(
    private readonly service: PuzzleService,
    private readonly producerService: RabbitMQProducerService
  ) {}

  @CacheTTL(30) // override TTL to 30 seconds
  @Get()
  async getAllPuzzles(): Promise<Puzzle[]> {
    return await this.service.getAllPuzzles();
  }

  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('/:id')
  async getPuzzle(@Param('id') id: string): Promise<Puzzle> {
    return await this.service.getPuzzle(id);
  }

  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('/date/:day')
  async getPuzzleByDate(@Param('day') day: string): Promise<Puzzle> {
    return await this.service.getPuzzleByDate(day);
  }

  @Post('/msg')
  async sendMessage(@Body() message: any) {
    await this.producerService.sendMessage('my_pattern', message);
    console.log('Message sent:', message);
    return { status: 'Message sent' };
  }
}
