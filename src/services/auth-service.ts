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

        if (getUser.success && getUser.data !== null) {
            return {
                success: false,
                data: null,
                error: getUser.error,
            };
        }

        const hashedPassword = await hash(password, 10)

        const accessToken = sign({ user: username }, JWT_SECRET, {
            expiresIn: "1h",
        })

        const created = await this.userService.createUser({
            username,
            password: hashedPassword,
            accessToken,
        });

        if (!created.success || created.data === null) {
            return {
                success: false,
                data: null,
                error: created.error,
            };
        }

        return {
            success: true,
            data: { message: "User registered successfully" },
            error: null,
        };
    }

    async login(username: string, password: string): Promise<Result<{ accessToken: string }>> {
        const getUser = await this.userService.getUserByUsername(username)

        if (!getUser.success || getUser.data === null) {
            return {
                success: false,
                data: null,
                error: getUser.error,
            };
        }

        const user = getUser.data;

        const passwordIsValid = user.password
            ? await compare(password, user.password)
            : false;

        if (!passwordIsValid) {
            return {
                success: false,
                data: null,
                error: new Error("Password is invalid"),
            };
        }

        const accessToken = sign({ user: username }, JWT_SECRET, {
            expiresIn: "1h",
        })

        const updateUser = await this.userService.updateUser({ username, password: user.password, accessToken })

        if (!updateUser.success || updateUser.data === null) {
            return {
                success: false,
                data: null,
                error: updateUser.error,
            };
        }

        const bucketCheck = await this.bucketService.getBucketByUser(username)

        if (!bucketCheck.success) {
            const bucket = await this.bucketService.create(updateUser.data)

            if (!bucket.success) {
                return {
                    success: bucket.success,
                    data: null,
                    error: bucket.error
                }
            }

            await this.bucketService.fillBucket(username)

        } else if (bucketCheck.success && bucketCheck.data.tokens.length === 0) {
            await this.bucketService.fillBucket(username)
            
        }

        return {
            success: true,
            data: { accessToken },
            error: null,
        };
    }
}