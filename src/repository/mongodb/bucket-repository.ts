import { Document } from "mongoose";
import { bucketModel, DocumentBucket } from "../../entities/bucket";
import { DocumentUser, userModel } from "../../entities/user";
import { Result, tryCatch } from "../../utils/trycatch";


export class BucketRepository {

    async create(input: DocumentUser): Promise<Result<DocumentBucket>> {

        const { data: user, error: userError } = await tryCatch(userModel.findOne({
            username: input.username
        }).select('bucket'))

        if (userError) {
            return {
                success: false,
                data: null,
                error: new Error("Failed to find user: " + userError.message)
            }
        }

        if (user?.bucket) {
            return {
                success: false,
                data: null,
                error: new Error("User already has a bucket")
            }
        }

        const { data: bucket, error: bucketError } = await tryCatch(bucketModel.create({
            tokens: []
        }))

        if (bucketError) {
            return {
                success: false,
                data: null,
                error: new Error("Failed to create bucket: " + bucketError.message)
            }
        }

        const { data: update, error: updateError } = await tryCatch(userModel.updateOne({ username: input.username },
            { bucket: bucket._id }))

        if (updateError) {
            return {
                success: false,
                data: null,
                error: new Error("Failed to assign bucket to user: " + updateError.message)
            }
        }

        if (update.modifiedCount === 0) {
            return {
                success: false,
                data: null,
                error: new Error("User not updated")
            }
        }

        return {
            success: true,
            data: bucket,
            error: null
        }
    }

    async getBucketByUser(username: string): Promise<Result<DocumentBucket>> {
        const { data, error } = await tryCatch(userModel.findOne({ username }).select('bucket').populate('bucket'))

        if (error) {
            return {
                success: false,
                data: null,
                error: new Error("Failed to find user: " + error.message)
            }
        }

        if (!data) {
            return {
                success: false,
                data: null,
                error: new Error("User not found")
            }
        }

        const bucket = data.bucket

        if (!bucket) {
            return {
                success: false,
                data: null,
                error: new Error("User has no bucket assigned")
            };
        }

        if (bucket instanceof Document) {
            return {
                success: true,
                data: bucket as DocumentBucket,
                error: null
            };
        }

        return {
            success: false,
            data: null,
            error: new Error("Unexpected bucket format - not a populated document")
        };
    }

    //fill bucket

    //update bucket

    //add tokens

    //revoke tokens

    //verify tokens

    //check if bucket is empty

    //amout of tokens
}