"use client";

import { useParams } from "next/navigation";
import { usePhysician } from "@/hooks/usePhysicians";
import SpinningLoader from "@/components/SpinningLoader";
import PhysicianSidebar from "@/components/PhysicianSidebar";

export default function PhysicianPage() {
  const { id } = useParams() as { id: string };
  const { data: physician, isLoading, error } = usePhysician(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinningLoader />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!physician) return <div>Physician not found</div>;

  return (
    <div className="flex">
      <div className="w-1/4 p-4 overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <PhysicianSidebar physician={physician} />
        </div>
      </div>
      <div className="w-3/4 p-4 overflow-y-auto">
        <p>Page for {physician.name} coming soon...</p>
      </div>
    </div>
  );
}
