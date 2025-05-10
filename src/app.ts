import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { UserResolver } from "./resolvers/user-resolver";
import { PixResolver } from "./resolvers/pix-resolver";

async function bootstrap() {
    const schema = await buildSchema({
        resolvers: [UserResolver, PixResolver],
    });

    const app = express();

    app.use(express.json());


    const graphqlHandler = createHandler({
        schema,
        context: (req, res) => {
            return {
                req,
                res,
            };
        },
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return error
        }
    });

    app.post("/graphql",
        (req, res, next) => {
            try {
                graphqlHandler(req as any, res as any, next)
            } catch (error) {
                next(error)
            }
        })

    return app
}


export default bootstrap;