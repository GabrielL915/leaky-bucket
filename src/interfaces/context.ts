import { Request, Response } from "express"
import { User } from "../entities/user";
export interface GraphqlContext {
    req: Request;
    res: Response;
    payload?: User
}