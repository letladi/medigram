import React, { useEffect, useState } from "react";
import { TextInput, FileInput } from "./FormInputs";
import { usePost } from "@/hooks/usePost";
import clsx from "clsx";
import Select from "react-select";
import { SA_PROVINCES, selectStyles } from "@/lib/constants";
import { isString } from "lodash";

interface PatientFormProps {
  onSubmit: () => void;
}

const provinceOptions = SA_PROVINCES.map((province) => ({
  value: province,
  label: province,
}));

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [postalCode, setPostalCode] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { postData, isLoading, error, data } = usePost("/api/patients");

  useEffect(() => {
    if (data) {
      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmit();
      }, 4000);
    }
  }, [data, onSubmit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const fields = {
      name,
      street,
      city,
      province: province?.value,
      postalCode,
      avatar,
    };

    Object.entries(fields).forEach(([fieldName, fieldValue]) => {
      if (!fieldValue) {
        newErrors[fieldName] = "required";
      } else if (isString(fieldValue)) {
        if (fieldValue.length < 3) {
          newErrors[fieldName] = "too short";
        } else if (fieldValue.length >= 20) {
          newErrors[fieldName] = "too long";
        }
      }
    });

    // Postal code validation
    if (fields.postalCode) {
      const postalCodeNumber = parseInt(fields.postalCode, 10);
      if (
        isNaN(postalCodeNumber) ||
        postalCodeNumber < 1 ||
        postalCodeNumber > 9999 ||
        fields.postalCode.length !== 4
      ) {
        newErrors.postalCode = "Invalid postal code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("province", province?.value || "");
    formData.append("postalCode", postalCode);
    if (avatar) formData.append("avatar", avatar);

    try {
      await postData(formData);
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
      className="space-y-6 max-w-6xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg"
    >
      <div className="flex justify-center mb-2">
        <FileInput
          error={errors.avatar}
          id="avatar"
          onChange={handleFileChange}
          previewUrl={previewUrl}
        />
      </div>

      {/* Input Fields (3 per line on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TextInput
          id="name"
          label="Full Name*"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
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

        <div className="relative">
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Province*{" "}
            {errors.province && (
              <span className="mt-1 text-sm text-red-500 ml-4">
                {errors.province}
              </span>
            )}
          </label>
          <Select
            id="province"
            options={provinceOptions}
            value={province}
            onChange={(selectedOption) => setProvince(selectedOption)}
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <TextInput
          id="postalCode"
          label="Postal Code*"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          error={errors.postalCode}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 invisible">
            Submit
          </label>
          <button
            type="submit"
            className={clsx(
              `w-full py-2 px-3 text-white font-semibold rounded-lg transition-all h-[42px]`,
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
              : "Add Patient"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-4">Error: {error.message}</p>
      )}
    </form>
  );
}
