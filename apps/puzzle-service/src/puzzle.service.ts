import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Puzzle } from '../objects/puzzle.interface';
import { MongoClient, ObjectId } from 'mongodb';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PuzzleService {
    private readonly collection: any;

    constructor(
        @Inject('RABBITMQ_CLIENT') private readonly mbusClient: ClientProxy,
        @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
        @Inject('MONGO_CLIENT') private readonly mongoClient: MongoClient,
        @Inject('DATABASE_NAME') private readonly databaseName: string,
        @Inject('COLLECTION_NAME') private readonly collectionName: string
    ) {
        this.collection = this.mongoClient.db(this.databaseName).collection(this.collectionName);
    }

    async getAllPuzzles(): Promise<Puzzle[]> {
        await this.mongoClient.connect();
        const res = await this.collection
            .find()
            .toArray() as Puzzle[];
        return res;
    }

    async getPuzzle(id: string): Promise<Puzzle> {
        // check if data is in cache:
        const cachedData = await this.cacheService.get<{ puzzle: Puzzle }>(id.toString());
        if (cachedData) {
            console.debug(`Getting data from cache!`);
            return cachedData.puzzle;
        }
        else {
            // if not, call data and set the cache: 
            // search in the database
            const res = await this.collection
                .findOne({ _id: new ObjectId(id) }) as Puzzle;

            // set the cache:            
            await this.cacheService.set(id.toString(), res);
            console.debug(`Put data in cache!`);
            return res;
        }
    }

    async getPuzzleByDate(day: string): Promise<Puzzle> {
        await this.mongoClient.connect();
        const res = await this.collection
            .findOne({ date: day }) as Puzzle;
        return res;
    }

    async addPuzzle(puzzle: Puzzle): Promise<void> {
        await this.mongoClient.connect();
        await this.collection.insertOne(puzzle);
        console.debug('Puzzle added to database!');
        this.publishPuzzleEvent(puzzle);
    }

    // Example method to publish a message
    async publishPuzzleEvent(puzzle: Puzzle) {
        return this.mbusClient.emit('puzzle_created', puzzle);
    }
}
