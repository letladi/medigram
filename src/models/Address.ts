import { Schema, model, models, Model } from "mongoose";
import { Address } from "@/types";

/** Address Schema */
const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
});

export const AddressModel: Model<Address> =
  models.Address || model<Address>("Address", addressSchema);

export { addressSchema }; // Export the schema to reuse in other models
