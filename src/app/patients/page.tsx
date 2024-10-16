'use client'

import { useState, useCallback } from 'react'
import { useGetPatients, useAddPatient } from '@/hooks/usePatients'
import PatientCard from '@/components/PatientCard'
import PatientForm from '@/components/PatientForm'
import Modal from '@/components/Modal'
import { SearchInput } from '@/components/FormInputs'
import debounce from 'lodash/debounce'
import { useModal } from '@/components/ModalProvider'

export default function PatientsPage() {
  const { data: patients, isLoading, error } = useGetPatients();
  const { postData: addPatient, isLoading: isAdding, error: addError } = useAddPatient();
  const [searchTerm, setSearchTerm] = useState('');
  const { isModalOpen, setIsModalOpen } = useModal();

  const handleAddPatient = async (formData: FormData) => {
    try {
      await addPatient(formData);
      setIsModalOpen(false);
      // Optionally, you can refetch the patients list here
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Patients</h1>

      <div className="mb-6">
        <SearchInput
          id="search"
          label=""
          type="text"
          onChange={handleSearchChange}
          placeholder="Search patients"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-900 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300">Error loading patients</h3>
              <div className="mt-2 text-sm text-red-200">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPatients && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 lg:grid-cols-5">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient._id} patient={patient} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
        <PatientForm onSubmit={handleAddPatient} />
        {isAdding && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        {addError && (
          <div className="mt-4 rounded-md bg-red-900 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Error adding patient</h3>
                <div className="mt-2 text-sm text-red-200">
                  <p>{addError.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}