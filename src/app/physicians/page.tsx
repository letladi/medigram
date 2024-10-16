'use client'

import { useState, useCallback } from 'react'
import { useGetPhysicians, useAddPhysician } from '@/hooks/usePhysicians'
import PhysicianCard from '@/components/PhysicianCard'
import PhysicianForm from '@/components/PhysicianForm'
import Modal from '@/components/Modal'
import { SearchInput } from '@/components/FormInputs'
import debounce from 'lodash/debounce'
import { useModal } from '@/components/ModalProvider'


export default function PhysiciansPage() {
  const { data: physicians, isLoading, error, fetchData } = useGetPhysicians();
  const [searchTerm, setSearchTerm] = useState('');
  const { isModalOpen, setIsModalOpen } = useModal();

  const afterAddCb = async () => {
    try {
      await fetchData()
      setIsModalOpen(false);
      // Optionally, you can refetch the physicians list here
    } catch (error) {
      console.error('Failed to add physician:', error);
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

  const filteredPhysicians = physicians?.filter(physician => 
    physician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    physician.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    physician.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Physicians</h1>

      <div className="mb-6">
        <SearchInput
          id="search"
          label=""
          type="text"
          onChange={handleSearchChange}
          placeholder="Search physicians"
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
              <h3 className="text-sm font-medium text-red-300">Error loading physicians</h3>
              <div className="mt-2 text-sm text-red-200">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPhysicians && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {filteredPhysicians.map((physician) => (
            <PhysicianCard key={physician._id} physician={physician} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Physician">
        <PhysicianForm onSubmit={afterAddCb} />
      </Modal>
    </>
  );
}