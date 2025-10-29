import { model, Schema, Types } from "mongoose";

export interface ICategory {
    _id: Types.ObjectId,
    name: string,
    projects: Types.ObjectId[]
}

export const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    }]})

export const Category = model<ICategory>("Category", categorySchema)