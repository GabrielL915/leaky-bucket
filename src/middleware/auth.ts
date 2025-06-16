import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { UserService } from '../services/user-service'
import { UserRepository } from '../repository/mongodb/user-repository'

const JWT_SECRET = process.env.JWT_SECRET ?? 'teste1'

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Token not provided' })
    }

    const [scheme, token] = authHeader.split(' ')
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Token is malformed' })
    }

    try {
        const payload = verify(token, JWT_SECRET) as { username: string }
        const userService = new UserService(new UserRepository())

        const user = await userService.getUserByUsername(payload.username)

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }
       (req as any).user = user
        next()
    } catch (error) {
        console.error('Auth error:', error)
        return res.status(401).json({ message: 'Token is invalid or expired' })
    }
}
