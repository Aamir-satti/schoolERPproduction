import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryProfile extends Document {
  teacherId: mongoose.Types.ObjectId;
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netSalary: number;
  effectiveDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const salaryProfileSchema = new Schema<ISalaryProfile>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true, unique: true, index: true },
    baseSalary: { type: Number, required: true, min: 0 },
    allowances: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
    }],
    deductions: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
    }],
    netSalary: { type: Number, required: true, min: 0 },
    effectiveDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SalaryProfile = mongoose.model<ISalaryProfile>('SalaryProfile', salaryProfileSchema);
