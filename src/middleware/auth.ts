import {Request, Response, NextFunction} from 'express';
import {verifyToken} from "../service/auth";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({error: 'Missing auth header'});
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({error: 'Missing token'});
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({error: 'Invalid token'});
    }

    (req as any).user = user;
    next()
}