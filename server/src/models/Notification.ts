import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'GENERAL' | 'ACADEMIC' | 'FINANCIAL' | 'EVENT';
  isPublic: boolean;
  targetRoles: ('ADMIN' | 'TEACHER' | 'STUDENT' | 'ALL')[];
  attachmentUrl?: string;
  externalLink?: string;
  publicationDate: Date;
  expiryDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['GENERAL', 'ACADEMIC', 'FINANCIAL', 'EVENT'],
      default: 'GENERAL',
    },
    isPublic: { type: Boolean, default: false, index: true },
    targetRoles: [{
      type: String,
      enum: ['ADMIN', 'TEACHER', 'STUDENT', 'ALL'],
    }],
    attachmentUrl: String,
    externalLink: String,
    publicationDate: { type: Date, required: true, index: true },
    expiryDate: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

notificationSchema.index({ publicationDate: -1, isPublic: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
