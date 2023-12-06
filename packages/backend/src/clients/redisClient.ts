import { RedisClientType, createClient } from 'redis';

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export { redisClient };
