import Image from 'next/image'
import { PhysicianWithStringId } from '@/types'
import { PhoneIcon, EnvelopeIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface PhysicianDetailsProps {
  physician: PhysicianWithStringId
}

export default function PhysicianDetails({ physician }: PhysicianDetailsProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-24 w-24">
            <Image
              className="h-24 w-24 rounded-full object-cover border-4 border-indigo-200"
              src={physician.avatarUrl || '/default-avatar.png'}
              alt={physician.name}
              width={96}
              height={96}
            />
          </div>
          <div className="ml-5">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">{physician.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{physician.specialization}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <PhoneIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{physician.contactNumber}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <EnvelopeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{physician.email}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <AcademicCapIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              License Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{physician.licenseNumber}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <MapPinIcon className="flex-shrink-0 mr-2 h-5 w-5 text-indigo-500" aria-hidden="true" />
              Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {physician.address.street}, {physician.address.city}, {physician.address.province}, {physician.address.postalCode}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}