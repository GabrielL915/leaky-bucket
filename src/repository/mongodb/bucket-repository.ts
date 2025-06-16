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
                data: null,
                error: new Error("Failed to find user: " + userError.message)
            }
        }

        if (user?.bucket) {
            return {
                data: null,
                error: new Error("User already has a bucket")
            }
        }

        const { data: bucket, error: bucketError } = await tryCatch(bucketModel.create({
            tokens: []
        }))

        if (bucketError) {
            return {
                data: null,
                error: new Error("Failed to create bucket: " + bucketError.message)
            }
        }

        const { data: update, error: updateError } = await tryCatch(userModel.updateOne({ username: input.username },
            { bucket: bucket._id }))

        if (updateError) {
            return {
                data: null,
                error: new Error("Failed to assign bucket to user: " + updateError.message)
            }
        }

        if (update.modifiedCount === 0) {
            return {
                data: null,
                error: new Error("User not updated")
            }
        }

        return {
            data: bucket,
            error: null
        }
    }

    async getBucketByUser(username: string): Promise<DocumentBucket | undefined> {
        const user = await userModel.findOne({ username }).select('bucket').populate('bucket')

        if (!user) throw new Error("User not find")

        const bucket = user.bucket


        if (bucket === undefined || bucket === null) throw new Error("Failed to get bucket")

        if (bucket instanceof Document) {
            return bucket as DocumentBucket
        }
    }

    //get bucket

    //fill bucket

    //update bucket

    //add tokens

    //revoke tokens

    //verify tokens

    //check if bucket is empty

    //amout of tokens
}