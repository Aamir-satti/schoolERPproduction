import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  subjectId?: mongoose.Types.ObjectId;
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'],
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records
attendanceSchema.index(
  { studentId: 1, date: 1, subjectId: 1 },
  { unique: true, sparse: true }
);
attendanceSchema.index({ classId: 1, date: 1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
