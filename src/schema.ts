export const typeDefs = `#graphql

type Error {
    message: String
}

type LoginData {
    accessToken: String!
}

type RegisterData {
    message: String!
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
    success: Boolean
    data: RegisterData
    error: Error
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