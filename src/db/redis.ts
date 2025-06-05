import Redis from 'ioredis';
import { tryCatch } from '../utils/trycatch';

const {
    REDIS_URL,
    REDIS_HOST = 'localhost',
    REDIS_PORT = '6379',
    REDIS_PASSWORD,
} = process.env;

const connectionString =
    REDIS_URL ??
    `redis://${REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : ''}${REDIS_HOST}:${REDIS_PORT}`;

/* const redis = new Redis(connectionString);
 */
let redisInstance: Redis | null = null;

function createRedisConnection(): Redis {
    return new Redis(connectionString, {
        lazyConnect: true
    });
}

export async function initializeRedis(): Promise<Redis> {
    if (redisInstance) {
        return redisInstance;
    }

    const redis = createRedisConnection();

    // Setup event listeners antes de conectar
    setupRedisEventListeners(redis);

    try {
        console.log('Conectando ao Redis...');

        // Conecta explicitamente
        await redis.connect();

        // Testa a conexão com ping
        const { data: pingResult, error: pingError } = await tryCatch(redis.ping());

        if (pingError) {
            throw new Error(`Falha no ping Redis: ${pingError.message}`);
        }

        if (pingResult !== 'PONG') {
            throw new Error(`Resposta inesperada do ping: ${pingResult}`);
        }

        console.log('Redis conectado e testado com sucesso');
        redisInstance = redis;

        return redis;

    } catch (error) {
        console.error('Falha ao inicializar Redis:', error);
        try {
            await redis.quit();
        } catch (quitError) {
            console.error('Erro ao fechar conexão Redis:', quitError);
        }

        throw error;
    }
}

function setupRedisEventListeners(redis: Redis): void {
    redis.on('connect', () => {
        console.log('Redis: Conectado');
    });

    redis.on('ready', () => {
        console.log('Redis: Pronto para uso');
    });

    redis.on('error', (err) => {
        console.error('Redis Error:', err.message);
    });

    redis.on('close', () => {
        console.log('Redis: Conexão fechada');
    });

    redis.on('reconnecting', (time: any) => {
        console.log(`Redis: Reconnectando em ${time}ms`);
    });

    redis.on('end', () => {
        console.log('Redis: Conexão encerrada');
        redisInstance = null; // Reset da instância
    });
}

export async function closeRedis(): Promise<void> {
    if (redisInstance) {
        console.log('Fechando conexão Redis...');
        await redisInstance.quit();
        redisInstance = null;
        console.log('Redis desconectado');
    }
}
export function getRedis(): Redis | null {
    return redisInstance;
}
