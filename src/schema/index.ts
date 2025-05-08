import {buildSchema} from "graphql";

const schema = buildSchema(`
  type Query {
    pix: Pix
  }
  
  type Pix {
  key: String!,
  values: Int!
  }

  type Mutation {
    queryPix(key: String!): Pix
  }
`);

export default schema;