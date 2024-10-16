import { useFetch } from './useFetch';
import { usePost } from './usePost';
import { Patient, PatientWithStringId } from '@/types';

export function useGetPatients() {
  return useFetch<PatientWithStringId[]>('/api/patients');
}

export function useAddPatient() {
  return usePost<{ id: string }>('/api/patients');
}