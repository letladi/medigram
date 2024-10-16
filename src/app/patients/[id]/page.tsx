"use client";

import { useParams } from "next/navigation";
import { usePatient } from "@/hooks/usePatient";
import PatientSidebar from "@/components/PatientSidebar";
import toast, { Toaster } from 'react-hot-toast';

export default function PatientPage() {
  const { id } = useParams() as { id: string };
  const { patient, isLoading, error } = usePatient(id);

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>;
  if (!patient) return <div className="flex items-center justify-center h-screen">Patient not found</div>;

  const handleAddRequisition = () => {
    toast.success('Coming soon!', {
      icon: '🚀',
      duration: 3000,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 p-4 overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <PatientSidebar
            patient={patient}
            onAddRequisition={handleAddRequisition}
          />
        </div>
      </div>
      <div className="w-3/4 p-4 overflow-y-auto">
        {/* Add more patient details or related information here */}
        <p>{patient.name}'s test and requisition data coming soon...</p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}