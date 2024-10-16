import React from 'react';
import Image from 'next/image';
import { PatientWithStringId } from '@/types';
import { PlusIcon } from '@heroicons/react/24/solid';

interface PatientSidebarProps {
  patient: PatientWithStringId;
  onAddRequisition: () => void;
}

export default function PatientSidebar({ patient, onAddRequisition }: PatientSidebarProps) {
  return (
    <div className="rounded-lg overflow-hidden min-h-96 flex flex-col border">
      <div className="relative w-full pt-[75%] flex-shrink-0">
        <Image
          src={patient.avatarUrl || '/avatars/patient-avatar.png'}
          alt={patient.name}
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{patient.name}</h2>
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">Address:</h3>
          <p>{patient.address?.street}</p>
          <p>{patient.address?.city}, {patient.address?.province} {patient.address?.postalCode}</p>
          <p>{patient.address?.country}</p>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <p className="font-bold text-lg">{patient.tests?.length || 0}</p>
            <p className="text-xs uppercase">Tests</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{patient.requisitions?.length || 0}</p>
            <p className="text-xs uppercase">Requisitions</p>
          </div>
        </div>
      </div>
      <div className="p-4 mt-auto">
        <button
          onClick={onAddRequisition}
          className="w-full bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Requisition
        </button>
      </div>
    </div>
  );
}