import { Document, model, Schema, Types } from "mongoose";
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
    bucket?: DocumentBucket | Types.ObjectId;
}
const userSchema = new Schema({
    username: { require: true, type: String, unique: true },
    password: { require: true, type: String },
    accessToken: { require: true, type: String },
    bucket: { type: Schema.Types.ObjectId, ref: "Bucket" }

})

export const userModel = model<DocumentUser>("User", userSchema);