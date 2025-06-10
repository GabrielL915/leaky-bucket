import { UserRepository } from "../repository/mongodb/user-repository";

export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }


    async register(username: string, password: string) {
        //find user

        //hash pass

        //create user


        //return message: user registered successfully
    }

    async login(username: string, password: string) {
        const getUser = await this.userRepository.findUserByUsername(username)

        if(!getUser) {
            throw new Error("User not found")
        }
        //compare password

        //generate tokens

        //update user?

        //create bucket if not exist

        //fill bucket

        //return token
    }
}