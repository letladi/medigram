import { ObjectId } from 'mongodb'

export interface Address {
  street: string
  city: string
  province: string
  postalCode: string
}

export interface Patient {
  _id?: ObjectId;
  name: string;
  address: Address;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Physician {
  _id?: ObjectId
  name: string
  specialization: string
  address: Address
  licenseNumber: string
  avatarUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Test {
  _id?: ObjectId
  name: string
  description: string
  normalRange?: string
  unit?: string
}

export interface Requisition {
  _id?: ObjectId
  patientId: ObjectId
  physicianId: ObjectId
  dateSubmitted: Date
  tests: Array<{
    testId: ObjectId
    result?: number
    comments?: string
  }>
  status: 'Pending' | 'Completed' | 'Cancelled'
  createdAt?: Date
  updatedAt?: Date
}

export type PatientWithStringId = Omit<Patient, '_id'> & { _id: string }
export type PhysicianWithStringId = Omit<Physician, '_id'> & { _id: string }
export type TestWithStringId = Omit<Test, '_id'> & { _id: string }
export type RequisitionWithStringId = Omit<Requisition, '_id' | 'patientId' | 'physicianId'> & { 
  _id: string
  patientId: string
  physicianId: string
  tests: Array<{
    testId: string
    result?: number
    comments?: string
  }>
}