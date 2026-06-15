import { Schema, model, Document } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  category: string;
  context: string;
  googleReviewUrl: string;
  keywords: string[];
  location: string;
  mobileNumber: string;
  isApproved: boolean;
  isActive: boolean;
  plan: 'free' | 'yearly' | 'lifetime';
  planStartDate: Date | null;
  planExpiry: Date | null;
  qrColor: string;
  qrBgColor: string;
  googleRefreshToken?: string;
  googleAccountId?: string;
  googleLocationId?: string;
  googleLocationName?: string;
  logoUrl?: string;
  salesPersonId?: Schema.Types.ObjectId | null;
  createdAt: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  context: { type: String, required: true, trim: true },
  googleReviewUrl: { type: String, required: true, trim: true },
  keywords: [{ type: String, trim: true }],
  location: { type: String, default: '', trim: true },
  mobileNumber: { type: String, default: '', trim: true },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  plan: { type: String, enum: ['free', 'yearly', 'lifetime'], default: 'free' },
  planStartDate: { type: Date, default: null },
  planExpiry: { type: Date, default: null },
  qrColor: { type: String, default: '#6C63FF' },
  qrBgColor: { type: String, default: '#FFFFFF' },
  googleRefreshToken: { type: String, default: '' },
  googleAccountId: { type: String, default: '' },
  googleLocationId: { type: String, default: '' },
  googleLocationName: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  salesPersonId: { type: Schema.Types.ObjectId, ref: 'SalesPerson', default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Business = model<IBusiness>('Business', BusinessSchema);
