import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Pix {
    @Field()
    key!: string;

    @Field()
    values!: number
}