import {buildSchema} from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
  }

  type Mutation {
    createUser(name: String!): User!
  }
`);

export default schema;