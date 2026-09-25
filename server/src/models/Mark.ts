import mongoose, { Schema, Document } from 'mongoose';

export interface IMark extends Document {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  obtainedMarks: number;
  maxMarks: number;
  passingMarks: number;
  grade: string;
  isPassed: boolean;
  enteredBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const markSchema = new Schema<IMark>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    obtainedMarks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 0 },
    passingMarks: { type: Number, required: true, min: 0 },
    grade: { type: String, required: true },
    isPassed: { type: Boolean, required: true },
    enteredBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  },
  { timestamps: true }
);

markSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });
markSchema.index({ examId: 1, subjectId: 1 });

export const Mark = mongoose.model<IMark>('Mark', markSchema);
