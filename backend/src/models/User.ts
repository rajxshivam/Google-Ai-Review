import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'merchant';
  businessId?: Schema.Types.ObjectId;
  createdAt: Date;
  passwordResetOtp?: string;
  passwordResetExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'merchant'], required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },
  createdAt: { type: Date, default: Date.now },
  passwordResetOtp: { type: String, select: false },
  passwordResetExpiry: { type: Date, select: false }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', UserSchema);
