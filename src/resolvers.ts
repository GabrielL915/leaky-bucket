import { GraphqlContext } from "./interfaces/context";
import { UserRepository } from "./repository/mongodb/user-repository";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userService)

export const resolvers = {

    Mutation: {
        register: async (_: unknown,
            { username, password }: { username: string, password: string },
            { req, res }: GraphqlContext
        ) => {
            const result = await authService.register(username, password)
            return result
        },

        login: async (_: unknown,
            { username, password }: { username: string, password: string },
            { req, res }: GraphqlContext
        ) => {
            const result = await authService.login(username, password)
            return result
        }
    },

    Query: {
        getUser: async (_: unknown, { username }: { username: string }, context: GraphqlContext) => {
            if(!context.payload) throw new Error("Unauthorized")
            const result = await userService.getUserByUsername(username)
            return result
        }
    }

}