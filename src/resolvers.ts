import { GraphqlContext } from "./interfaces/context";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";
import { BucketService } from "./services/bucket-service";

const userService = new UserService();
const bucketService = new BucketService()
const authService = new AuthService(userService, bucketService)

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
            return {
                success: result.success,
                data: result.data,
                error: result.error
            }
        }
    },

    Query: {
        getUser: async (_: unknown, { username }: { username: string }, context: GraphqlContext) => {
            if (!context.payload) throw new Error("Unauthorized")
            const result = await userService.getUserByUsername(username)
            return result
        }
    }

}