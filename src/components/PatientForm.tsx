import React, { useState } from 'react';
import { TextInput, FileInput } from './FormInputs';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface PatientFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('street', street);
    formData.append('city', city);
    formData.append('province', province);
    formData.append('postalCode', postalCode);
    if (avatar) formData.append('avatar', avatar);

    await onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
      {/* Avatar Upload Section */}
      <div className="flex items-center space-x-6">
        {/* Avatar Preview or Placeholder */}
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
              <UserCircleIcon className="w-16 h-16" />
            </div>
          )}
        </div>
        
        {/* File Input */}
        <FileInput id="avatar" label="Upload Avatar" onChange={handleFileChange} />
      </div>

      {/* Input Fields (One per Line) */}
      <TextInput
        id="name"
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextInput
        id="street"
        label="Street Address"
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        required
      />
      <TextInput
        id="city"
        label="City"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <TextInput
        id="province"
        label="Province"
        type="text"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        required
      />
      <TextInput
        id="postalCode"
        label="Postal Code"
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
      />

      {/* Submit Button */}
      <div className="pt-5">
        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Add Patient
        </button>
      </div>
    </form>
  );
}
