import { Request, Response } from "express"
import { DocumentUser, User } from "../entities/user";
export interface GraphqlContext {
    req: Request;
    res: Response;
    payload?: DocumentUser
}