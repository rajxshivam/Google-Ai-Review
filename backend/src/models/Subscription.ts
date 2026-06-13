import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  businessId: Schema.Types.ObjectId;
  plan: 'yearly' | 'lifetime';
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: 'active' | 'revoked' | 'expired';
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  plan: { type: String, enum: ['yearly', 'lifetime'], required: true },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: '' },
  transactionId: { type: String, default: '' },
  status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
