import React from 'react';
import Image from 'next/image';
import { PhysicianWithStringId } from '@/types';

interface PhysicianSidebarProps {
  physician: PhysicianWithStringId;
}

export default function PhysicianSidebar({ physician }: PhysicianSidebarProps) {
  return (
    <div className="rounded-lg overflow-hidden max-h-full flex flex-col border">
      <div className="relative w-full pt-[75%] flex-shrink-0">
        <Image
          src={physician.avatarUrl || '/avatars/physician-avatar.png'}
          alt={physician.name}
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{physician.name}</h2>
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">Specialization:</h3>
          <p>{physician.specialization}</p>
        </div>
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">License Number:</h3>
          <p>{physician.licenseNumber}</p>
        </div>
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">Address:</h3>
          <p>{physician.address?.street}</p>
          <p>{physician.address?.city}, {physician.address?.province} {physician.address?.postalCode}</p>
        </div>

      </div>
    </div>
  );
}