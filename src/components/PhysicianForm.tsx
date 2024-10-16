import React, { useEffect, useState } from "react";
import { TextInput, FileInput } from "./FormInputs";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { usePost } from "@/hooks/usePost";
import clsx from "clsx";

interface PhysicianFormProps {
  onSubmit: () => void;
}

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

export default function PhysicianForm({ onSubmit }: PhysicianFormProps) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { postData, isLoading, error, data } = usePost("/api/physicians");

  useEffect(() => {
    if (data) {
      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmit();
      }, 4000);
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const fields = {
      name,
      specialization,
      registrationNumber,
      licenseNumber,
      street,
      city,
      province,
      postalCode,
      avatar,
    };

    Object.entries(fields).forEach(([fieldName, fieldValue]) => {
      if (!fieldValue) newErrors[fieldName] = "required";
    });

    if (!SA_PROVINCES.includes(province)) {
      newErrors.province = "Invalid province";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("specialization", specialization);
    formData.append("registrationNumber", registrationNumber);
    formData.append("licenseNumber", licenseNumber);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("province", province);
    formData.append("postalCode", postalCode);
    if (avatar) formData.append("avatar", avatar);

    try {
      await postData(formData);
      onSubmit();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg mx-auto bg-gray-900 p-8 rounded-xl shadow-lg"
    >
      {/* Avatar Upload Section */}
      <div className="flex items-center space-x-6">
        <FileInput
          id="avatar"
          label="Avatar*"
          onChange={handleFileChange}
          previewUrl={previewUrl}
        />
        {errors.avatar && (
          <p className="text-red-500 text-sm">{errors.avatar}</p>
        )}
      </div>

      {/* Input Fields */}
      <TextInput
        id="name"
        label="Full Name*"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <TextInput
        id="specialization"
        label="Specialization*"
        type="text"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        error={errors.specialization}
      />
      <TextInput
        id="registrationNumber"
        label="Registration Number*"
        type="text"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
        error={errors.registrationNumber}
      />
      <TextInput
        id="licenseNumber"
        label="License Number*"
        type="text"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        error={errors.licenseNumber}
      />
      <TextInput
        id="street"
        label="Street Address*"
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        error={errors.street}
      />
      <TextInput
        id="city"
        label="City*"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        error={errors.city}
      />
      <TextInput
        id="province"
        label="Province*"
        type="text"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        error={errors.province}
      />
      <TextInput
        id="postalCode"
        label="Postal Code*"
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        error={errors.postalCode}
      />

      {/* Submit Button */}
      <div className="pt-5">
        <button
          type="submit"
          className={clsx(
            `w-full py-3 text-white font-semibold rounded-lg transition-all`,
            {
              "bg-gray-500": isLoading && !data,
              "bg-indigo-600 hover:bg-indigo-700": !isLoading && !data,
              "bg-green-500": data,
            }
          )}
          disabled={isLoading}
        >
          {submitSuccess
            ? "Patient Added Successfully"
            : isLoading
            ? "Adding..."
            : "Add Physician"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-4">Error: {error.message}</p>
      )}
    </form>
  );
}
