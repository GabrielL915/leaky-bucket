export const typeDefs = `#graphql

type Error {
    message: String
}

type LoginData {
    accessToken: String!
}

type User {
    username: String
    password: String
    accessToken: String
}

type LoginResponse {
    success: Boolean
    data: LoginData
    error: Error
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
    getUser(username: String!): User
}

type Mutation {
    login(username: String!, password: String!): LoginResponse
    register(username: String!, password: String!): RegisterResponse
    queryPix(key: String!, value: Int!): PixResponse
}
`