import { DocumentUser, userModel } from "../../entities/user";

//TODO: better error handling
export class UserRepository {
    async createUser(input: any): Promise<DocumentUser> {
        const newUser = await userModel.create(input)
        return newUser
    }

    async findUserByUsername(username: string): Promise<DocumentUser | null> {
        const user = await userModel.findOne({
            username: username
        })
        return user

    }

    async updateUser(user: any): Promise<DocumentUser> {
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