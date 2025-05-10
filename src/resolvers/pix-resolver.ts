import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Pix } from "../entities/pix";
import { auth } from "../middleware/auth";
import { Context } from "../context/context";
import { leakyBucketService } from "../service/leaky-bucket";

@Resolver()
export class PixResolver {
    @Query(() => Pix)
    pix() {
        return {
            key: '123',
            values: 123
        };
    }

    //TODO: Refatorar, apenas simulação
    @Mutation(() => Pix, { nullable: true })
    @UseMiddleware(auth)
    async queryPixKey(
        @Arg('key') key: string,
        @Arg('value') value: number,
        @Ctx() { payload }: Context
    ): Promise<Pix> {
        const hasToken = await leakyBucketService.consumeToken(payload!.userId);

        if (!hasToken) {
            throw new Error('Rate limit exceeded, Try again later.');
        }
        try {
            return {
                key,
                values: value
            }
        } catch (error) {
            await leakyBucketService.reffilTokens(payload!.userId);
            throw new Error('Failed to create pix');
        }
    }

    @Query(() => Number)
    @UseMiddleware(auth)
    async getTokens(@Ctx() { payload }: Context): Promise<number> {
        return await leakyBucketService.getTokens(payload!.userId);
    }
}