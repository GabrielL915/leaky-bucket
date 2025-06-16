import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./schema";
import { GraphqlContext } from "./interfaces/context";
import { resolvers } from "./resolvers";
import { initializeRedis } from "./config/redis";
import { connectMongoDB } from "./config/mongodb";
import { verify } from "jsonwebtoken";
import { UserRepository } from "./repository/mongodb/user-repository";
import { UserService } from "./services/user-service";
async function bootstrap() {
    const app = express();
    app.use(express.json());

    await initializeRedis();

    await connectMongoDB();


    const graphql = new ApolloServer<GraphqlContext>({
        typeDefs,
        resolvers,
    })

    await graphql.start();

    app.use("/graphql",
        express.json(),
        expressMiddleware(graphql, {
            context: async ({ req, res }): Promise<GraphqlContext> => {
                const authHeader = req.headers.authorization;
                let user = undefined;
                const JWT_SECRET = process.env.JWT_SECRET ?? 'teste1';


                if (authHeader && authHeader.startsWith("Bearer ")) {
                    const token = authHeader.split(" ")[1];

                    try {
                        const decoded = verify(token as string, JWT_SECRET);

                        if (typeof decoded === 'object' && decoded !== null && 'username' in decoded) {
                            const payload = decoded as { username: string };

                            const userRepository = new UserRepository();
                            const userService = new UserService(userRepository);

                            user = await userService.getUserByUsername(payload.username);
                        }
                    } catch (err) {
                        console.error("Auth context error:", err);
                    }
                }

                return { req, res, payload: user };
            },
        }))
    return app
}


export default bootstrap;