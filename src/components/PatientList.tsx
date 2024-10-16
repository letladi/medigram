'use client'

import { useState, useEffect } from 'react'
import PatientCard from './PatientCard'
import AddPatientModal from './AddPatientModal'
import { PatientWithStringId } from '@/types'

export default function PatientList() {
  const [patients, setPatients] = useState<PatientWithStringId[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const response = await fetch('/api/patients')
    const data = await response.json()
    setPatients(data)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Patients</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          Add Patient
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient._id} patient={patient} />
        ))}
      </div>
      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPatientAdded={fetchPatients} 
      />
    </div>
  )
}