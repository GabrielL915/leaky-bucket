import Redis from 'ioredis';

const {
    REDIS_URL,
    REDIS_HOST = 'localhost',
    REDIS_PORT = '6379',
    REDIS_PASSWORD,
} = process.env;

const connectionString =
    REDIS_URL ??
    `redis://${REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : ''}${REDIS_HOST}:${REDIS_PORT}`;

const redis = new Redis(connectionString);

redis.on('connect', () => console.log('Redis conectado'));
redis.on('error', err => console.error(' Erro no Redis', err));

export default redis;
