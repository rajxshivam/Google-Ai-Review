import { Schema, model, Document } from 'mongoose';

export interface IFeedback extends Document {
  businessId: Schema.Types.ObjectId;
  rating: number;
  feedbackText: string;
  customerContact?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedbackText: { type: String, required: true, trim: true },
  customerContact: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Feedback = model<IFeedback>('Feedback', FeedbackSchema);
