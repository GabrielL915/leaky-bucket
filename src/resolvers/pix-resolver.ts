import { Query, Resolver } from "type-graphql";
import { Pix } from "../entities/pix";

@Resolver()
export class PixResolver {
    @Query(() => Pix)
    pix() {
        return {
            key: '123',
            values: 123
        };
    }
}