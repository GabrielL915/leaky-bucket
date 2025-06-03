export const typeDefs = `#graphql
type User {
    id: String
    username: String
    token: String
}

type LoginResponse {
    token: String
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
    login(username: String, password: String): LoginResponse
    queryPix(key: String, value: Int): PixResponse
}
`