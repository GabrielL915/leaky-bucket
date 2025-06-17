import { DocumentUser, User, userModel } from "../entities/user";
import { Result, tryCatch } from "../utils/trycatch";

export class UserService {

    async createUser(input: User): Promise<Result<DocumentUser>> {
        const existingUser = await this.getUserByUsername(input.username);

        if (existingUser.success) {
            return {
                success: false,
                data: null,
                error: new Error("User already exists")
            };
        }

        const result = await tryCatch(userModel.create(input));

        if (result.success && result.data !== null) {
            return {
                success: true,
                data: result.data,
                error: null
            };
        }

        if (!result.success) {
            return {
                success: false,
                data: null,
                error: new Error("Failed to create user: " + result.error.message)
            };
        }

        return {
            success: false,
            data: null,
            error: new Error("Unexpected null user creation result")
        };
    }

    async getUserByUsername(username: string): Promise<Result<DocumentUser>> {
        const result = await tryCatch(userModel.findOne({
            username: username
        }))

        if (result.success && result.data !== null) {
            return {
                success: true,
                data: result.data,
                error: null
            }
        }

        if (!result.success) {
            return {
                success: false,
                data: null,
                error: new Error("User not found ")
            }
        }

        return {
            success: false,
            data: null,
            error: new Error("Unexpected null user data")
        }
    }

    async updateUser(user: User): Promise<Result<DocumentUser>> {
        const result = await tryCatch(userModel.findOneAndUpdate({
            username: user.username
        }, user, {
            new: true, runValidators: true
        }))

        if (result.success && result.data !== null) {
            return {
                success: true,
                data: result.data,
                error: null
            };
        }

        if (!result.success) {
            return {
                success: false,
                data: null,
                error: new Error("User not found to update: " + result.error.message)
            };
        }

        return {
            success: false,
            data: null,
            error: new Error("Unexpected null user update result")
        };
    }
}