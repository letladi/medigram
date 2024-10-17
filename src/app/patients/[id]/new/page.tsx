"use client";

import RequisitionForm from "@/components/RequisitionForm";
import { useParams, useRouter } from "next/navigation";

export default function NewRequisitionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleSubmitSuccess = () => {
    // Redirect to the patient page after submitting the requisition form
    router.push(`/patients/${id}`);
  };

  return (
    <RequisitionForm patientId={id} onSubmitSuccess={handleSubmitSuccess} />
  );
}
