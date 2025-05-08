import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { auth } from "../middleware/auth";
import { Context } from "../context/context";
import { Pix } from "../entities/pix";

@Resolver()
export class UserResolver {
    @Query(() => Pix)
    pix() {
        return {
            key: '123',
            values: 123
        };
    }

    @Query(() => String)
   /*  @UseMiddleware(auth) */
    test(@Ctx() {payload}: Context) {
        console.log(payload)
        return `Hello ${payload!.userId}`
    }
}