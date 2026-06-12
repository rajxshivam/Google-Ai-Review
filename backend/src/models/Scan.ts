import { Schema, model, Document } from 'mongoose';

export interface IScan extends Document {
  businessId: Schema.Types.ObjectId;
  createdAt: Date;
}

const ScanSchema = new Schema<IScan>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Scan = model<IScan>('Scan', ScanSchema);
