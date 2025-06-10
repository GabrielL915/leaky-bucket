import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'teste1'

type Headers = {
    Authorization: `Bearer ${string}`;
}

export function authMiddleware(req: Request<unknown, unknown, unknown, Headers>, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token not formed" })
    }

    try {
        const payload = verify(token, JWT_SECRET) as { username: string }
        req.body = payload
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" })
    }
}