import mongoose, { Schema, Document } from "mongoose";

export interface IAttachment extends Document {
  fileName: string;
  originalName: string;
  path: string;
  size: number;
  uploadedAt: Date;
}

export interface IObject extends Document {
  title: string;
  attachments: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const objectSchema = new Schema<IObject>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IObject>("Object", objectSchema);
