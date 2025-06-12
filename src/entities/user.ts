import { Document, model, Schema } from "mongoose";
import { DocumentBucket } from "./bucket";


export interface User {
    username: string;
    password: string;
    accessToken: string
}

export interface DocumentUser extends Document {
    username: string;
    password: string;
    accessToken: string;
    bucket?: DocumentBucket;
}
const userSchema = new Schema({
    username: { require: true, type: String, unique: true },
    password: { require: true, type: String },
    accessToken: { require: true, type: String }

})

export const userModel = model<DocumentUser>("User", userSchema);