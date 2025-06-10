/* import { User } from "./entities/user";
 */
import { GraphqlContext } from "./interfaces/context";
import { UserRepository } from "./repository/mongodb/user-repository";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository); // Assumindo que UserService precisa do repository
const authService = new AuthService(userRepository, userService)

export const resolvers = {

    /*     Query: {
            getUser: async (_: unknown,
                {id}: {id: string},
                {req, res}: GraphqlContext
            ): Promise <User> => {
                
                return { id: id, username: "teste", token: "user:${id}:tokens"}
            }
        } */

    Mutation: {
        register: async (_: unknown,
            { username, password }: { username: string, password: string },
            { req, res }: GraphqlContext
        ) => {
            const result = await authService.register(username, password)
            return result
        }
    }

    /*     Mutation: {
            login: async ()
            queryPix: async
        } */
}