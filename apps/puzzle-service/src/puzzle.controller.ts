import { Body, Controller, Get, Post, Param,UseInterceptors, Req } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PuzzleService } from './puzzle.service';
import { puzzle } from '../objects/puzzle.interface';
import { RabbitMQProducerService } from './producer.service';

@Controller()
export class PuzzleController {
    constructor(private readonly service: PuzzleService, private readonly producerService: RabbitMQProducerService) {}

    @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
    @CacheTTL(30) // override TTL to 30 seconds
    @Get()
    async getAllPuzzles(): Promise<puzzle[]> {
        return await this.service.getAllPuzzles();
    }

    @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
    @CacheTTL(30) // override TTL to 30 seconds
    @Get('/:id')
    async getPuzzle(@Param('id') id: string): Promise<puzzle> {
      return await this.service.getPuzzle(id);
    } 

    @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
    @CacheTTL(30) // override TTL to 30 seconds
    @Get('/date/:day')
    async getPuzzleByDate(@Param('day') day: string): Promise<puzzle> {
      return await this.service.getPuzzleByDate(day);
    } 

    @Post('/msg')
    async sendMessage(@Body() message: any) {
      await this.producerService.sendMessage('my_pattern', message);
      console.log('Message sent:', message);
      return { status: 'Message sent' };
    }
}
