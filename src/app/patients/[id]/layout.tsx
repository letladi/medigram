"use client";

import { useParams, useRouter } from "next/navigation";
import { usePatient } from "@/hooks/usePatient";
import PatientSidebar from "@/components/PatientSidebar";
import SpinningLoader from "@/components/SpinningLoader";
import { Toaster } from 'react-hot-toast';

export default function PatientPage({ children }: { children: React.ReactNode }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { patient, isLoading, error } = usePatient(id);

  const handleAddRequisition = () => {
    router.push(`/patients/${id}/new`);
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><SpinningLoader /></div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>;
  if (!patient) return <div className="flex items-center justify-center h-screen">Patient not found</div>;

 

  return (
    <div className="flex">
      <div className="w-1/4 p-4 overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <PatientSidebar
            patient={patient}
            onAddRequisition={handleAddRequisition}
          />
        </div>
      </div>
      <div className="w-3/4 p-4 overflow-y-auto">
        {children}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
