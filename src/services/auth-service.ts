import { sign } from "jsonwebtoken";
import { compare, hash } from "bcrypt"
import { UserService } from "./user-service";
import { Result } from "../utils/trycatch";
import { BucketService } from "./bucket-service";

const JWT_SECRET = process.env.JWT_SECRET ?? 'teste1'

export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly bucketService: BucketService,
    ) { }


    async register(username: string, password: string) {
        const getUser = await this.userService.getUserByUsername(username)
        if (getUser) {
            throw new Error("User already exists")
        }

        const hashedPassword = await hash(password, 10)

        const accessToken = sign({ user: username }, JWT_SECRET, {
            expiresIn: "1h",
        })

        const userCreated = this.userService.createUser({ username, password: hashedPassword, accessToken })

        return { message: "User registered successfuly" }
    }

    async login(username: string, password: string) {
        const getUser = await this.userService.getUserByUsername(username)

        if (!getUser) {
            throw new Error("User not found")
        }

        getUser.password
            ? await compare(password, getUser.password)
            : (() => { throw new Error("Password is invalid"); })();


        const accessToken = sign({ user: username }, JWT_SECRET, {
            expiresIn: "1h",
        })

        const updateUser = await this.userService.updateUser({ username, password: getUser.password, accessToken })

        const bucket = await this.bucketService.create(updateUser)

        if (!bucket.success) {
            return {
                success: bucket.success,
                data: null,
                error: bucket.error
            }
        }

        //fill bucket
        return {
            success: true,
            data: { accessToken },
            error: null,
        };
    }
}