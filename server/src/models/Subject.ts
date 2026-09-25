import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  classIds: mongoose.Types.ObjectId[];
  teacherIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, index: true },
    classIds: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    teacherIds: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subjectSchema.index({ code: 1 }, { unique: true });
subjectSchema.index({ isActive: 1 });

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
