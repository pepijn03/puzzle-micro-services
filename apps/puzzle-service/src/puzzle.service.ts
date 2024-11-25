import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Puzzle } from '../objects/puzzle.interface';
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
import { ClientProxy } from '@nestjs/microservices';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

// Set the collection
const coll = client.db(process.env.DATABASE).collection(process.env.COLLECTION);

@Injectable()
export class PuzzleService {
    constructor(
        @Inject('RABBITMQ_CLIENT') private client: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheService: Cache,
    ) {}

    async getAllPuzzles(): Promise<Puzzle[]> {
        await client.connect();
        console.debug(`Connected to MongoDB!`);
        const res = await coll
            .find()
            .toArray() as Puzzle[];
        return res;
    }

    async getPuzzle(id:string): Promise<Puzzle> {
        // check if data is in cache:
        const cachedData = await this.cacheService.get<{ puzzle: Puzzle }>(id.toString());
        if (cachedData) {
            console.debug(`Getting data from cache!`);
            return cachedData.puzzle;
        }
        else {
            // if not, call data and set the cache: 
            // search in the database
            const res = await coll
                .findOne({_id: new ObjectId(id)}) as Puzzle;


            // set the cache:            
            await this.cacheService.set(id.toString(), res);
            console.debug(`Put data in cache!`);
            return res;
        }
    }

    async getPuzzleByDate(day: string): Promise<Puzzle> {
        await client.connect();
        const res = await coll
            .findOne({date: day}) as Puzzle;
        return res;
    }

    async addPuzzle(puzzle: Puzzle): Promise<void> {
        await client.connect();
        await coll.insertOne(puzzle);
        console.debug('Puzzle added to database!');
        this.publishPuzzleEvent(puzzle);
    }

    // Example method to publish a message
    async publishPuzzleEvent(puzzle: Puzzle) {
        return this.client.emit('puzzle_created', puzzle);
    }
}
