import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  code: string;
  sections: { _id?: mongoose.Types.ObjectId; name: string }[];
  academicYear?: string;
  classTeacherId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, index: true },
    sections: [{
      name: { type: String, required: true, trim: true },
    }],
    academicYear: { type: String, trim: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

classSchema.index({ code: 1 }, { unique: true });
classSchema.index({ isActive: 1 });

export const Class = mongoose.model<IClass>('Class', classSchema);
