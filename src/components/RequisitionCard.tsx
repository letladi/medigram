import Link from "next/link";
import { RequisitionWithStringId } from "@/types";

interface RequisitionCardProps {
  requisition: RequisitionWithStringId;
}

export default function RequisitionCard({ requisition }: RequisitionCardProps) {
  return (
    <Link href={`/requisitions/${requisition._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Requisition ID: {requisition._id}
          </h3>
          <p className="text-gray-600">
            Date: {new Date(requisition.dateSubmitted).toLocaleDateString()}
          </p>
          <p className="text-gray-600">Status: {requisition.status}</p>
          <p className="text-gray-600">Tests: {requisition.tests.length}</p>
        </div>
      </div>
    </Link>
  );
}
