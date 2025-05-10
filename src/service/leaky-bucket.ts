import redis from "../data-source/redis-client";
export class LeakyBucketService {
    private readonly MAX_TOKENS = 10;
    private readonly REFILL_INTERVAL = 60 * 60; //1 token por hora;

    async getTokens(userId: string) {
        const tokens = await redis.get(`user:${userId}:tokens`);
        if (!tokens) {
            await redis.set(`user:${userId}:tokens`, this.MAX_TOKENS);
            return this.MAX_TOKENS;
        };
        return parseInt(tokens);
    }

    async consumeToken(userId: string) {
        const tokens = await this.getTokens(userId);
        if (tokens <= 0) {
            return false;
        }
        await redis.set(`user:${userId}:tokens`, Math.max(0, tokens - 1));
        return true;
    }

    async reffilTokens(userId: string) {
        const tokens = await this.getTokens(userId);

        if (tokens < this.MAX_TOKENS) {
            await redis.set(`user:${userId}:tokens`, Math.min(0, tokens + 1));
        }
    }

    setupTokenRefillScheduler(): void {
        setInterval(async () => {
            try {
                const userKeys = await redis.keys('user:*:tokens');
                const userIds = userKeys.map(key => {
                    const match = key.match(/user:(.+):tokens/);
                    return match ? match[1] : null;
                }).filter(Boolean);

                for (const userId of userIds) {
                    if (userId) {
                        await this.reffilTokens(userId);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, this.REFILL_INTERVAL * 1000);
    }
}