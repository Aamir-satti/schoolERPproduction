import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  registrationNo: string;
  admissionNo: string;
  admissionDate: Date;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  religion?: string;
  fatherName: string;
  motherName?: string;
  guardianPhone: string;
  guardianEmail?: string;
  currentAddress?: string;
  permanentAddress?: string;
  classId: mongoose.Types.ObjectId;
  sectionId?: string;
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED';
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    registrationNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    admissionNo: {
      type: String,
      required: true,
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: true,
    },
    bloodGroup: String,
    religion: String,
    fatherName: {
      type: String,
      required: true,
    },
    motherName: String,
    guardianPhone: {
      type: String,
      required: true,
    },
    guardianEmail: String,
    currentAddress: String,
    permanentAddress: String,
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    sectionId: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'GRADUATED', 'TRANSFERRED', 'DROPPED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
studentSchema.index({ classId: 1, status: 1 });
studentSchema.index({ registrationNo: 1 }, { unique: true });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
