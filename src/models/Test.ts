import { Schema, model, models, Model } from "mongoose";
import { Test } from "@/types";

/** Test Schema */
const testSchema = new Schema<Test>({
  name: { type: String, required: true },
  normalRange: { type: String },
  unit: { type: String },
  requisitionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Requisition",
  },
  patientId: { type: Schema.Types.ObjectId, required: true, ref: "Patient" },
});

export const TestModel: Model<Test> =
  models.Test || model<Test>("Test", testSchema);
