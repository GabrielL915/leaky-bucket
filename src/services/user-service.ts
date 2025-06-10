import { UserRepository } from "../repository/mongodb/user-repository";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(input: any) {
        const existingUser = await this.userRepository.findUserByUsername(input.username);

        if (!existingUser) {
            //hash da senha
            const newUser = await this.userRepository.createUser(input)
            return newUser
        }

        throw new Error("Failed to Create User")
    }

    async getUserByUsername(username: string) {
        const user = await this.userRepository.findUserByUsername(username)
        return user
    }

    async update(user: any) {
        const updatedUser = await this.userRepository.updateUser(user)
        return updatedUser
    }
}