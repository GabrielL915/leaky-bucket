import { MiddlewareFn } from "type-graphql";
import { Context } from "../context/context";
import { leakyBucketService } from "../service/leaky-bucket";

export const leakyBucket: MiddlewareFn<Context> = async ({ context }, next) => {
    const userId = context.payload?.userId;
    
    if (!userId) {
        throw new Error("Authentication required");
    }
    
    const hasTokens = await leakyBucketService.getTokens(userId) > 0;
    
    if (!hasTokens) {
        throw new Error("Rate limit exceeded. Please try again later.");
    }
    
    return next();
};