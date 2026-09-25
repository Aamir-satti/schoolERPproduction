import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  classId: mongoose.Types.ObjectId;
  sectionId?: string;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  startTime: string;
  endTime: string;
  roomNo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    sectionId: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    dayOfWeek: {
      type: String,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    roomNo: { type: String, trim: true },
  },
  { timestamps: true }
);

timetableSchema.index({ classId: 1, dayOfWeek: 1 });
timetableSchema.index({ teacherId: 1, dayOfWeek: 1 });

export const Timetable = mongoose.model<ITimetable>('Timetable', timetableSchema);
