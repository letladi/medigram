"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PatientWithStringId } from '@/types';

interface PatientDetailsProps {
  patient: PatientWithStringId;
}

export default function PatientDetails({ patient }: PatientDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    pathname.includes('/tests') ? 'tests' : 'requisitions'
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Patient Info Section */}
      <div className="bg-gray-50 shadow-lg p-6">
        <div className="flex items-center space-x-6">
          <Image
            src={patient.avatarUrl || '/avatars/patient-avatar.png'}
            alt={patient.name}
            width={100}
            height={100}
            className="rounded-full object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-sm text-gray-600">
              {patient.gender}, {new Date(patient.dateOfBirth).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              {patient.address.city}, {patient.address.province}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'tests'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => {
              router.push(`/patients/${patient._id}/tests`);
              setActiveTab('tests');
            }}
          >
            View Tests
          </button>

          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'requisitions'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => {
              router.push(`/patients/${patient._id}/requisitions`);
              setActiveTab('requisitions');
            }}
          >
            View Requisitions
          </button>
        </div>
      </div>

      {/* Content Section: Tests or Requisitions */}
      <div className="flex-1 overflow-y-auto p-6">
        {pathname.includes('/tests') && <Tests patientId={patient._id} />}
        {pathname.includes('/requisitions') && <Requisitions patientId={patient._id} />}
      </div>
    </div>
  );
}

// Placeholder for Tests Component
function Tests({ patientId }: { patientId: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Tests for Patient {patientId}</h3>
      <ul className="space-y-2">
        {Array.from({ length: 30 }, (_, i) => (
          <li key={i} className="p-2 bg-gray-50 rounded-md shadow-sm">
            Test {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Placeholder for Requisitions Component
function Requisitions({ patientId }: { patientId: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Requisitions for Patient {patientId}</h3>
      <ul className="space-y-2">
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i} className="p-2 bg-gray-50 rounded-md shadow-sm">
            Requisition {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}
