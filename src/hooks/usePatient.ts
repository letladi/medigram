import { useState, useEffect } from 'react';
import { PatientWithStringId } from '@/types';

export function usePatient(id: string) {
  const [state, setState] = useState<{
    patient: PatientWithStringId | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    patient: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setState({ patient: data, isLoading: false, error: null });
      } catch (error) {
        setState({ patient: null, isLoading: false, error: error as Error });
      }
    };

    fetchPatient();
  }, [id]);

  return state;
}