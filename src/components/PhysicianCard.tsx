import Image from 'next/image';
import Link from 'next/link';
import { PhysicianWithStringId } from '@/types';

interface PhysicianCardProps {
  physician: PhysicianWithStringId;
  onAddClick: () => void;
}

export default function PhysicianCard({ physician }: PhysicianCardProps) {

  return (
    <div className="relative w-full h-72 rounded-md overflow-hidden shadow-lg bg-gray-200">
      {/* Avatar */}
      <Image
        src={physician.avatarUrl || '/avatars/physician-avatar.png'}
        alt={physician.name}
        layout="fill"
        objectFit="cover"
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Physician Info */}
      <div className="absolute bottom-24 left-6 text-white">
        <Link href={`/physicians/${physician._id}`} passHref>
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">
            {physician.name}
          </h2>
        </Link>
        <p className="text-sm">
          {physician.specialization}
        </p>
      </div>

      {/* Patients & Requisitions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 flex justify-between px-6 py-4">
        <div className="text-center">
          <p className="text-gray-700 font-bold text-xl">{physician.patients.length}</p>
          <p className="text-gray-500 text-xs">PATIENTS</p>
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-bold text-xl">{physician.requisitions.length}</p>
          <p className="text-gray-500 text-xs">REQUISITIONS</p>
        </div>
      </div>
    </div>
  );
}