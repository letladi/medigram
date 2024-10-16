'use client'

import { useParams } from 'next/navigation'
import { usePhysician } from '@/hooks/usePhysicians'
import PhysicianDetails from '@/components/PhysicianDetails'

export default function PhysicianPage() {
  const { id } = useParams() as { id: string }
  const { data: physician, isLoading, error } = usePhysician(id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!physician) return <div>Physician not found</div>

  return <PhysicianDetails physician={physician} />
}