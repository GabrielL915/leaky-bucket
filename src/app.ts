import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./schema";
import { GraphqlContext } from "./interfaces/context";
import { resolvers } from "./resolvers";
import { initializeRedis } from "./db/redis";
async function bootstrap() {
    const app = express();
    app.use(express.json());

    await initializeRedis();

    const graphql = new ApolloServer<GraphqlContext>({
        typeDefs,
        resolvers,
    })

    await graphql.start();

    app.use("/graphql",
        express.json(),
        expressMiddleware(graphql, {
            context: async ({ req, res }): Promise<GraphqlContext> => {
                return { req, res }
            }
        }))
    return app
}


export default bootstrap;