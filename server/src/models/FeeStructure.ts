import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeStructure extends Document {
  name: string;
  classId: mongoose.Types.ObjectId;
  academicYear: string;
  components: {
    name: string;
    amount: number;
    frequency: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    dueDay?: number;
  }[];
  totalAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feeStructureSchema = new Schema<IFeeStructure>(
  {
    name: { type: String, required: true, trim: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    academicYear: { type: String, required: true },
    components: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      frequency: {
        type: String,
        enum: ['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
        required: true,
      },
      dueDay: { type: Number, min: 1, max: 31 },
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

feeStructureSchema.index({ classId: 1, academicYear: 1 });

export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', feeStructureSchema);
