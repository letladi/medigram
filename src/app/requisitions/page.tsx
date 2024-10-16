'use client'

import { useState, useCallback } from 'react'
import { SearchInput } from '@/components/FormInputs'
import Modal from '@/components/Modal'
import debounce from 'lodash/debounce'
import { useModal } from '@/components/ModalProvider'

export default function RequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isModalOpen, setIsModalOpen } = useModal();

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Requisitions</h1>

      <div className="mb-6">
        <SearchInput
          id="search"
          label=""
          type="text"
          onChange={handleSearchChange}
          placeholder="Search requisitions"
        />
      </div>

      <div className="text-center text-gray-500 mt-10">
        <p>Requisition functionality coming soon...</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Requisition">
        <div className="text-center text-gray-500 mt-4">
          <p>Requisition form coming soon...</p>
        </div>
      </Modal>
    </>
  );
}