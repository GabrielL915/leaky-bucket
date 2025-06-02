export const typeDefs = `#graphql
type User = {
    id: String
    username: String
    tokem: String
}

type LoginResponse {
    tokem: String
    message: String
}

type PixResponse {
    value: Int
    tokensLeft: Int
    message: String
}

type Query {
    user(id: String): User
}

type Mutation {
    login(username: String, password: String): LoginResponse
    queryPix(key: String, value: Int): PixResponse
}
`