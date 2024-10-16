import Image from 'next/image'
import Link from 'next/link'
import { PhysicianWithStringId } from '@/types'
import { PhoneIcon, EnvelopeIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface PhysicianCardProps {
  physician: PhysicianWithStringId
}

export default function PhysicianCard({ physician }: PhysicianCardProps) {
  return (
    <Link href={`/physicians/${physician._id}`}>
      <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20">
              <Image
                className="h-20 w-20 rounded-full object-cover border-4 border-indigo-200"
                src={physician.avatarUrl || '/default-avatar.png'}
                alt={physician.name}
                width={80}
                height={80}
              />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-semibold text-gray-900">{physician.name}</h3>
              <p className="text-sm text-gray-500">{physician.specialization}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm">
              <PhoneIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              <span className="text-gray-600">{physician.contactNumber}</span>
            </div>
            <div className="flex items-center text-sm">
              <EnvelopeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              <span className="text-gray-600">{physician.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <AcademicCapIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              <span className="text-gray-600">License: {physician.licenseNumber}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              View physician details<span aria-hidden="true"> &rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}