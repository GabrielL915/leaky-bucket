import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
    @Field()
    id!: string;
    
    @Field()
    name!: string;
}

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken!: string;
    @Field(() => User)
    user!: User;
}