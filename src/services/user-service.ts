import { User, userModel } from "../entities/user";
import { tryCatch } from "../utils/trycatch";

export class UserService {
    constructor() { }

    async createUser(input: User) {
        const existingUser = await this.getUserByUsername(input.username);

        if (!existingUser) {
            const { data, error } = await tryCatch(userModel.create(input))

            if (error) return

            return data
        }

        throw new Error("Failed to Create User")
    }

    async getUserByUsername(username: string): Promise<User> {
        const { data, error } = await tryCatch(userModel.findOne({
            username: username
        }))

        if (error || !data) {
            throw new Error
        }

        return {
            username: data.username,
            password: data.password,
            accessToken: data.accessToken
        }
    }

    async updateUser(user: User) {
        const updateUser = await userModel.findOneAndUpdate({
            username: user.username
        }, user, {
            new: true, runValidators: true
        })

        if (!updateUser) {
            throw new Error("Error while updating user")
        }

        return updateUser;
    }
}