import jwt from 'jsonwebtoken';
import {User} from "../interfaces/user";

const JWT_SECRET = process.env.JWT_SECRET || 'test';
const JWT_EXPIRE = '1h';

//mock
const users: User[] = [
    {id: '1', name: 'João'},
    {id: '2', name: 'Maria'},
];

export function generateToken(user: User): string {
    return jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRE});
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        const user = <User>users.find(users => users.id === decoded.userId);//trocar pra mongo
        return {userId: user.id};
    } catch (error) {
        console.log(error);
    }
}