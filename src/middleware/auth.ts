import { MiddlewareFn } from "type-graphql";
import { verifyToken } from "../service/auth";
import { Context } from '../context/context';

export const auth: MiddlewareFn<Context> = ({ context }, next) => {
    const authorization = context.req.headers.authorization;
    if (!authorization) {
        throw new Error('Not authenticated');
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = verifyToken(token as string);
        if(!payload) {
            throw new Error('Not authenticated');
        }
        context.payload = {userId: payload.userId};
        context.payload.userId = payload.userId;
    } catch (error) {
        throw new Error('Not authenticated');
    }
    return next();
}