import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PatientWithStringId } from "@/types";
import { PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

interface PatientCardProps {
  patient: PatientWithStringId;
  onAddClick: () => void;
}

export default function PatientCard({ patient, onAddClick }: PatientCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-72 rounded-md overflow-hidden shadow-lg bg-gray-200">
      {/* Avatar */}
      <Image
        src={patient.avatarUrl || "/avatars/patient-avatar.png"}
        alt={patient.name}
        layout="fill"
        objectFit="cover"
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Patient Info */}
      <div className="absolute bottom-24 left-6 text-white">
        <Link href={`/patients/${patient._id}`} passHref>
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">
            {patient.name}
          </h2>
        </Link>
        <p className="text-sm">
          {patient.address.city}, {patient.address.province}
        </p>
      </div>

      {/* Tests & Requisitions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 flex justify-between px-6 py-4">
        <div className="text-center">
          <p className="text-gray-700 font-bold text-xl">
            {patient.tests.length}
          </p>
          <p className="text-gray-500 text-xs">TESTS</p>
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-bold text-xl">
            {patient.requisitions.length}
          </p>
          <p className="text-gray-500 text-xs">REQUISITIONS</p>
        </div>
      </div>

      {/* Add Test Button */}
      <button
        onClick={onAddClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          `absolute right-2 bottom-14 h-12 bg-pink-500 rounded-full text-white text-sm font-semibold flex items-center justify-center shadow-lg hover:bg-pink-600 transition-all duration-300 overflow-hidden`,
          {
            "w-56 px-4": isHovered,
            "w-12": !isHovered,
          },
        )}
      >
        {isHovered && <span className=" min-w-44">Add Requisition</span>}
        <PlusIcon className="w-6 h-6 flex-shrink-0" />
      </button>
      {/** Toast for the card **/}
      <Toaster position="top-right" />
    </div>
  );
}
