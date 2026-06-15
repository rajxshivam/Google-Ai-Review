import { Schema, model, Document } from 'mongoose';

export type SupportedLanguage = 'English' | 'Hindi' | 'Gujarati';

export interface IStockReview extends Document {
  businessId: Schema.Types.ObjectId;
  rating: number; // 2, 3, 4, 5
  reviewText: string;
  isUsed: boolean;
  language: SupportedLanguage;
  createdAt: Date;
}

const StockReviewSchema = new Schema<IStockReview>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  rating: { type: Number, required: true, min: 2, max: 5 },
  reviewText: { type: String, required: true, trim: true },
  isUsed: { type: Boolean, default: false },
  language: { type: String, enum: ['English', 'Hindi', 'Gujarati'], required: true, default: 'English' },
  createdAt: { type: Date, default: Date.now }
});

// Index to optimize querying available reviews for a business
StockReviewSchema.index({ businessId: 1, rating: 1, language: 1, isUsed: 1 });

export const StockReview = model<IStockReview>('StockReview', StockReviewSchema);
