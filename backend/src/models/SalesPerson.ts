import { Schema, model, Document } from 'mongoose';

export interface ISalesPerson extends Document {
  name: string;
  mobileNumber: string;
  commissionPercentage: number;
  createdAt: Date;
}

const SalesPersonSchema = new Schema<ISalesPerson>({
  name: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  commissionPercentage: { type: Number, required: true, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export const SalesPerson = model<ISalesPerson>('SalesPerson', SalesPersonSchema);
