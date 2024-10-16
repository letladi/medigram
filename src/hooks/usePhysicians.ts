import { useFetch } from './useFetch';
import { usePost } from './usePost';
import { PhysicianWithStringId } from '@/types';

export function useGetPhysicians() {
  return useFetch<PhysicianWithStringId[]>('/api/physicians');
}

export function useAddPhysician() {
  return usePost<{ id: string }>('/api/physicians');
}

export function usePhysician(id: string) {
  return useFetch<PhysicianWithStringId>(`/api/physicians/${id}`);
}