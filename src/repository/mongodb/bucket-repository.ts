import { bucketModel, DocumentBucket } from "../../entities/bucket";
import { DocumentUser, userModel } from "../../entities/user";

export class BucketRepository {

    async create(input: DocumentUser): Promise<DocumentBucket> {

        const user = await userModel.findOne({
            username: input.username
        }).select('bucket')

        if (user?.bucket) {
            throw new Error("User already have a bucket")
        }

        const newBucket = await bucketModel.create({
            tokens: []
        })

        await userModel.updateOne({ username: input.username }, { bucket: newBucket._id })

        return newBucket
    }
}