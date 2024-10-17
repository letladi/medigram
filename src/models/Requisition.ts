import { Schema, model, models, Model } from 'mongoose';
import { Requisition } from '@/types';

/** Requisition Schema */
const requisitionSchema = new Schema<Requisition>({
  patientId: { type:Schema.Types.ObjectId, required: true, ref: 'Patient' },
  physicianId: { type: Schema.Types.ObjectId, required: true, ref: 'Physician' },
  dateSubmitted: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], required: true, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const RequisitionModel: Model<Requisition> =
  models.Requisition || model< Requisition>('Requisition', requisitionSchema);
