import { User } from "../entities/user";
import { UserRepository } from "../repository/mongodb/user-repository";
import { tryCatch } from "../utils/trycatch";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(input: User) {
        const existingUser = await this.userRepository.findUserByUsername(input.username);

        if (!existingUser) {
            const newUser = await this.userRepository.createUser(input)
            return newUser
        }

        throw new Error("Failed to Create User")
    }

    async getUserByUsername(username: string): Promise<User> {
        const { data, error } = await tryCatch(this.userRepository.findUserByUsername(username))

        if (error || !data) {
            throw new Error
        }

        return {
            username: data.username,
            password: data.password,
            accessToken: data.accessToken
        }
    }

    async update(user: User) {
        const updatedUser = await this.userRepository.updateUser(user)
        return updatedUser
    }
}