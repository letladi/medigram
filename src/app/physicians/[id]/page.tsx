"use client";

import { useParams } from "next/navigation";
import { usePhysician } from "@/hooks/usePhysicians";
import SpinningLoader from "@/components/SpinningLoader";

export default function PhysicianPage() {
  const { id } = useParams() as { id: string };
  const { data: physician, isLoading, error } = usePhysician(id);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><SpinningLoader /></div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!physician) return <div>Physician not found</div>;

  return (
    <div className="text-center text-gray-500 mt-4">
      <p>Page for {physician.name} coming soon...</p>
    </div>
  );
}
