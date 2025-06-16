import { Document, model, Schema } from "mongoose";

export interface DocumentBucket extends Document {
    
    tokens: Array<string>,
    lastTimestamp: Date,
    emptyBucket: boolean
}



const bucketSchema = new Schema({
    tokens: { require: true, type: [String], default: [] },
    lastTimestamp: { require: true, type: Date, default: Date.now },
    emptyBucket: { type: Boolean, require: true, default: false }
})

export const bucketModel = model<DocumentBucket>("Bucket", bucketSchema);