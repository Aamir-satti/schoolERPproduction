import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  name: string;
  term: 'FIRST' | 'SECOND' | 'THIRD' | 'FINAL';
  academicYear: string;
  classIds: mongoose.Types.ObjectId[];
  subjects: {
    subjectId: mongoose.Types.ObjectId;
    maxMarks: number;
    passingMarks: number;
    examDate: Date;
  }[];
  startDate: Date;
  endDate: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    name: { type: String, required: true, trim: true },
    term: { type: String, enum: ['FIRST', 'SECOND', 'THIRD', 'FINAL'], required: true },
    academicYear: { type: String, required: true },
    classIds: [{ type: Schema.Types.ObjectId, ref: 'Class', required: true }],
    subjects: [{
      subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
      maxMarks: { type: Number, required: true, min: 0 },
      passingMarks: { type: Number, required: true, min: 0 },
      examDate: { type: Date, required: true },
    }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

examSchema.index({ classIds: 1, academicYear: 1 });
examSchema.index({ status: 1 });

export const Exam = mongoose.model<IExam>('Exam', examSchema);
