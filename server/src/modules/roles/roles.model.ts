import { model, Schema, Types } from "mongoose";

export interface IRole {
  _id: Types.ObjectId;
  name: string;
  category: Types.ObjectId;
}

export const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// чтобы в одной категории не было двух одинаковых ролей
roleSchema.index({ category: 1, name: 1 }, { unique: true });

export const Role = model<IRole>("Role", roleSchema);