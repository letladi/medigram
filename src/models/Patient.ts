import  { Schema, model, models, Document, Model } from 'mongoose';
import { Patient } from '@/types';

/** Patient Schema */
const patientSchema = new Schema<Patient>({
  name: { type: String, required: true },
  addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true }, // Corrected ObjectId reference
  avatarUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const PatientModel: Model<Document & Patient> =
  models.Patient || model<Document & Patient>('Patient', patientSchema);
