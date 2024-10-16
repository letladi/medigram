'use client'

import { useParams } from 'next/navigation'
import { usePatient } from '@/hooks/usePatient'
import PatientDetails from '@/components/PatientDetails'

export default function PatientPage() {
  const { id } = useParams() as { id: string }
  const { patient, isLoading, error } = usePatient(id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!patient) return <div>Patient not found</div>

  return <PatientDetails patient={patient} />
}