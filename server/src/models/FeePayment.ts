import mongoose, { Schema, Document } from 'mongoose';

export interface IFeePayment extends Document {
  studentId: mongoose.Types.ObjectId;
  feeStructureId: mongoose.Types.ObjectId;
  month: string;
  component: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentDate?: Date;
  paymentMethod?: 'CASH' | 'BANK' | 'ONLINE' | 'OTHER';
  referenceNo?: string;
  remarks?: string;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  challanNo: string;
  createdAt: Date;
  updatedAt: Date;
}

const feePaymentSchema = new Schema<IFeePayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    feeStructureId: {
      type: Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    component: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ['CASH', 'BANK', 'ONLINE', 'OTHER'],
    },
    referenceNo: String,
    remarks: String,
    status: {
      type: String,
      enum: ['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'],
      default: 'UNPAID',
    },
    challanNo: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

feePaymentSchema.index({ studentId: 1, month: 1, component: 1 });
feePaymentSchema.index({ status: 1, month: 1 });

export const FeePayment = mongoose.model<IFeePayment>('FeePayment', feePaymentSchema);
