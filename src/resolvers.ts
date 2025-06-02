import { User } from "./entities/user";
import { GraphqlContext } from "./interfaces/context";

export const resolvers = {

    Query: {
        getUser: async (_: unknown,
            {id}: {id: string},
            {req, res}: GraphqlContext
        ): Promise <User> => {
            
            return { id: id, username: "teste", token: "user:${id}:tokens"}
        }
    }

/*     Mutation: {
        login: async ()
        queryPix: async
    } */
}