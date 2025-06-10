import mongoose from "mongoose";
import { tryCatch } from '../utils/trycatch';

const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/bucket'


export async function connectMongoDB() {
    const { data, error } = await tryCatch(mongoose.connect(connectionString))
    if (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        return
    }
    console.log("Connected to MongoDB")
}