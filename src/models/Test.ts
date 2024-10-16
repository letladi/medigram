import mongoose, { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Test } from '@/types';

/** Test Schema */
const testSchema = new Schema<Test>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  normalRange: { type: String },
  unit: { type: String },
  requisitionId: { type: Schema.Types.ObjectId, required: true, ref: 'Requisition' },
  patientId: { type: Schema.Types.ObjectId, required: true, ref: 'Patient' },
});

export const TestModel: Model<Document & Test> =
  models.Test || model<Document & Test>('Test', testSchema);
