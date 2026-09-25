import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryRecord extends Document {
  teacherId: mongoose.Types.ObjectId;
  salaryProfileId: mongoose.Types.ObjectId;
  month: string;
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  paidAmount: number;
  balanceAmount: number;
  paymentDate?: Date;
  paymentMethod?: 'CASH' | 'BANK' | 'ONLINE' | 'OTHER';
  referenceNo?: string;
  remarks?: string;
  status: 'UNPAID' | 'PARTIAL' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

const salaryRecordSchema = new Schema<ISalaryRecord>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    salaryProfileId: { type: Schema.Types.ObjectId, ref: 'SalaryProfile', required: true },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    totalAllowances: { type: Number, required: true, default: 0 },
    totalDeductions: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['CASH', 'BANK', 'ONLINE', 'OTHER'] },
    referenceNo: String,
    remarks: String,
    status: {
      type: String,
      enum: ['UNPAID', 'PARTIAL', 'PAID'],
      default: 'UNPAID',
    },
  },
  { timestamps: true }
);

salaryRecordSchema.index({ teacherId: 1, month: 1 }, { unique: true });

export const SalaryRecord = mongoose.model<ISalaryRecord>('SalaryRecord', salaryRecordSchema);
