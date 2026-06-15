import { Schema, model, Document } from 'mongoose';

export interface ISettlement extends Document {
  salesPersonId: Schema.Types.ObjectId;
  amount: number;
  notes: string;
  createdAt: Date;
}

const SettlementSchema = new Schema<ISettlement>({
  salesPersonId: { type: Schema.Types.ObjectId, ref: 'SalesPerson', required: true },
  amount: { type: Number, required: true, min: 0 },
  notes: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const Settlement = model<ISettlement>('Settlement', SettlementSchema);
