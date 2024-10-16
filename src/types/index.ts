import { ObjectId } from 'mongodb';

/** Address Interface */
export interface Address {
  _id?: ObjectId;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

/** Patient Interface */
export interface Patient {
  _id?: ObjectId;
  name: string;
  addressId: ObjectId; // Reference to the Address document
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export type PatientWithStringId = Omit<Patient, '_id' | 'addressId'> & { 
  _id: string; 
  addressId: string; 
  address: Address;
  tests: TestWithStringId[];
  requisitions: RequisitionWithStringId[];
};

/** Physician Interface */
export interface Physician {
  _id?: ObjectId;
  name: string;
  specialization: string;
  addressId: ObjectId; // Reference to the Address document
  licenseNumber: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export type PhysicianWithStringId = Omit<Physician, '_id' | 'addressId'> & { 
  _id: string; 
  addressId: string; 
  patients: PatientWithStringId[];
  requisitions: RequisitionWithStringId[];
};

/** Test Interface */
export interface Test {
  _id?: ObjectId;
  name: string;
  description: string;
  normalRange?: string;
  unit?: string;
  requisitionId: ObjectId;  // Reference to Requisition
  patientId: ObjectId;      // Reference to the Patient/User
}
export type TestWithStringId = Omit<Test, '_id' | 'requisitionId' | 'patientId'> & { 
  _id: string; 
  requisitionId: string; 
  patientId: string; 
};

/** Requisition Interface */
export interface Requisition {
  _id?: ObjectId;
  patientId: ObjectId;
  physicianId: ObjectId;
  dateSubmitted: Date;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}
export type RequisitionWithStringId = Omit<Requisition, '_id' | 'patientId' | 'physicianId'> & {
  _id: string;
  patientId: string;
  physicianId: string;
};
