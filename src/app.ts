import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { GraphqlContext } from "./interfaces/context";
import { resolvers } from "./resolvers";
async function bootstrap() {


    const app = express();
    app.use(express.json());

    const graphql = new ApolloServer<GraphqlContext>({
        typeDefs,
        resolvers,
    })

    await graphql.start();
    return app
}


export default bootstrap;