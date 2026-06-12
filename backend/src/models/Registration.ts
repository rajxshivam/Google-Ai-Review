import { Schema, model, Document } from 'mongoose';

export interface IRegistration extends Document {
  name: string;
  category: string;
  context: string;
  googleReviewUrl: string;
  location: string;
  mobileNumber: string;
  email: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  context: { type: String, required: true, trim: true },
  googleReviewUrl: { type: String, required: true, trim: true },
  location: { type: String, default: '', trim: true },
  mobileNumber: { type: String, default: '', trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Registration = model<IRegistration>('Registration', RegistrationSchema);
