import { Document, model, Schema } from "mongoose";
import { DocumentBucket } from "./bucket";

interface DocumentUser extends Document {
    username: string;
    password: string;
    token: string;
    bucket?: DocumentBucket;
}

const userSchema = new Schema({
    username: { require: true, type: String, unique: true },
    password: { require: true, type: String },
    token: { require: true, type: String }

})

export default model<DocumentUser>("User", userSchema);