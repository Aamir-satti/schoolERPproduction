import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  designation: string;
  department?: string;
  qualification?: string;
  experience?: number;
  joiningDate: Date;
  subjectIds: mongoose.Types.ObjectId[];
  classIds: mongoose.Types.ObjectId[];
  isClassTeacher: boolean;
  assignedClassId?: mongoose.Types.ObjectId;
  assignedSectionId?: string;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    designation: {
      type: String,
      required: true,
    },
    department: String,
    qualification: String,
    experience: Number,
    joiningDate: {
      type: Date,
      required: true,
    },
    subjectIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    classIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    isClassTeacher: {
      type: Boolean,
      default: false,
    },
    assignedClassId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    assignedSectionId: String,
    employmentStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ employeeId: 1 }, { unique: true });
teacherSchema.index({ employmentStatus: 1 });

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);
