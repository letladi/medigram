import  { Schema, model, models, Document, Model } from 'mongoose';
import { Physician } from '@/types';

/** Physician Schema */
const physicianSchema = new Schema<Physician>({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true }, // Correct reference
  licenseNumber: { type: String, required: true },
  avatarUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const PhysicianModel: Model<Physician> =
  models.Physician || model<Physician>('Physician', physicianSchema);
