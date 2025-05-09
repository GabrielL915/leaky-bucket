import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { auth } from "../middleware/auth";
import { Context } from "../context/context";
import { Pix } from "../entities/pix";
import { LoginResponse } from "../entities/user";
import { generateToken } from "../service/auth";
import { users } from "../entities/mocks/user-mock";


@Resolver()
export class UserResolver {
    @Query(() => Pix)
    pix() {
        return {
            key: '123',
            values: 123
        };
    }

    @Mutation(() => LoginResponse)
    async login(@Arg('name') name: string) {
        const user = users.find(user => user.name === name);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = generateToken(user);
        return {
            accessToken,
            user
        }
    }

    @Query(() => String)
    @UseMiddleware(auth)
    test(@Ctx() { payload }: Context) {
        console.log(payload)
        return `Hello ${payload!.userId}`
    }
}