import { Body, Controller, Get, Param,UseInterceptors, Req } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PuzzleService } from './puzzle.service';
import { puzzle } from '../objects/puzzle.interface';

@Controller()
export class PuzzleController {
    constructor(private readonly service: PuzzleService) {}

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
}
