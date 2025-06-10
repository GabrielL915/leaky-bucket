export const typeDefs = `#graphql
type User {
    id: String
    username: String
    accessToken: String
}

type LoginResponse {
    accessToken: String
}

type RegisterResponse {
    message: String
}

type PixResponse {
    value: Int
    tokensLeft: Int
    message: String
}

type Query {
    getUser(id: String): User
}

type Mutation {
    login(username: String!, password: String!): LoginResponse
    register(username: String!, password: String!): RegisterResponse
    queryPix(key: String!, value: Int!): PixResponse
}
`