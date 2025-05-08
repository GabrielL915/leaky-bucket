import express from "express";
import {createHandler} from "graphql-http/lib/use/express";
import schema from './schema/index';
import resolvers from "./resolvers/index";

const app = express();

app.use(express.json());

const graphqlHandler = createHandler({
    schema,
    rootValue: resolvers,
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error
    }
});

app.all("/graphql", (req, res, next) => {
    try {
        graphqlHandler(req as any, res as any, next)
    } catch (error) {
        next(error)
    }
})

export default app;