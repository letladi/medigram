"use client";

import { useParams } from "next/navigation";
import { usePatient } from "@/hooks/usePatient";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import SpinningLoader from "@/components/SpinningLoader";
import React from "react";

export default function PatientPage() {
  const { id } = useParams() as { id: string };
  const { patient, isLoading, error } = usePatient(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <SpinningLoader />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error.message}
      </div>
    );
  if (!patient)
    return (
      <div className="flex items-center justify-center h-full">
        Patient not found
      </div>
    );

  if (patient.requisitions.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        No requisitions for user
      </div>
    );

  return (
    <div className="space-y-4 h-full p-4">
      {patient.requisitions.map((requisition) => (
        <Disclosure key={requisition._id}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-lg font-medium text-left text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 shadow-md">
                <span>Requisition ID: {requisition._id}</span>
                <ChevronUpIcon
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-6 h-6 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-base text-gray-200 bg-gray-800 rounded-lg shadow-inner mt-2">
                <div className="mb-2">
                  <strong>Physician:</strong> {requisition.physician?.name || "N/A"}
                </div>
                <div>
                  <strong>Tests:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.tests
                      .filter((test) => test.requisitionId === requisition._id)
                      .map((test) => (
                        <li key={test._id} className="text-gray-300">
                          {test.name} 
                        </li>
                      ))}
                  </ul>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
