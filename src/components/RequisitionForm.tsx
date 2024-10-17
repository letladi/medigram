import React, { useEffect, useState } from "react";
import Select from "react-select";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useGetPhysicians } from "@/hooks/usePhysicians";
import { usePost } from "@/hooks/usePost";
import { PhysicianWithStringId, RequisitionWithStringId } from "@/types";
import Link from "next/link";
import { TextInput } from "@/components/FormInputs";

interface FormData {
  physicianId: string;
  testTypes: { value: string; label: string }[];
  samples: string[];
}

interface FormErrors {
  physicianId?: string;
  testTypes?: string;
  samples?: string;
}

const testTypes = [
  { value: "blood_count", label: "Complete Blood Count" },
  { value: "lipid_panel", label: "Lipid Panel" },
  { value: "thyroid_function", label: "Thyroid Function" },
  { value: "liver_function", label: "Liver Function" },
  { value: "kidney_function", label: "Kidney Function" },
  { value: "hba1c", label: "HbA1c" },
  { value: "vitamin_d", label: "Vitamin D" },
  { value: "iron_panel", label: "Iron Panel" },
  { value: "urinalysis", label: "Urinalysis" },
  { value: "electrolytes", label: "Electrolytes" },
];

const MAX_SAMPLES = 8;

interface RequisitionFormProps {
  patientId: string;
  onSubmitSuccess: () => void;
}

const RequisitionForm: React.FC<RequisitionFormProps> = ({
  patientId,
  onSubmitSuccess,
}) => {
  const {
    data: physicians,
    isLoading: isLoadingPhysicians,
    error: physiciansError,
  } = useGetPhysicians();
  const {
    postData,
    isLoading: isPosting,
    error: postError,
    data: postSuccessData,
  } = usePost<RequisitionWithStringId>("/api/requisitions");

  const [formData, setFormData] = useState<FormData>({
    physicianId: "",
    testTypes: [],
    samples: [""],
  });

  useEffect(() => {
    if (postSuccessData) {
      onSubmitSuccess();
    }
  }, [postSuccessData]);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addSampleInput = () => {
    if (formData.samples.length < MAX_SAMPLES) {
      setFormData((prev) => ({ ...prev, samples: [...prev.samples, ""] }));
    }
  };

  const removeSampleInput = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index),
    }));
  };

  const handleSampleChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      samples: prev.samples.map((sample, i) => (i === index ? value : sample)),
    }));
    setErrors((prev) => ({ ...prev, samples: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.physicianId) {
      newErrors.physicianId = "Physician is required";
    }

    if (formData.testTypes.length === 0) {
      newErrors.testTypes = "At least one test type is required";
    }

    if (formData.samples.every((sample) => sample.trim() === "")) {
      newErrors.samples = "At least one sample reference is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("patientId", patientId);
    formDataToSend.append("physicianId", formData.physicianId);
    formData.testTypes.forEach((test, index) => {
      formDataToSend.append(`testNames[${index}]`, test.label);
    });
    formData.samples.forEach((sample, index) => {
      if (sample.trim() !== "") {
        formDataToSend.append(`samples[${index}]`, sample);
      }
    });

    try {
      const result = await postData(formDataToSend);
      console.log("Requisition created successfully", result);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error creating requisition:", error);
      // Handle error (e.g., show error message)
    }
  };

  if (isLoadingPhysicians)
    return <div className="text-gray-300">Loading physicians...</div>;
  if (physiciansError)
    return (
      <div className="text-red-500">
        Error loading physicians: {physiciansError.message}
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-lg h-full"
    >
      <Link
        href={`/patients/${patientId}`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Patient
      </Link>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Referring Physician
        </label>
        <Select
          value={
            formData.physicianId
              ? {
                  value: formData.physicianId,
                  label: physicians?.find((p) => p._id === formData.physicianId)
                    ?.name,
                }
              : null
          }
          onChange={(selected) =>
            handleInputChange("physicianId", selected?.value || "")
          }
          options={
            physicians?.map((physician) => ({
              value: physician._id,
              label: physician.name,
            })) || []
          }
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#4B5563",
              borderColor: errors.physicianId ? "#EF4444" : "#6B7280",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#4B5563",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused ? "#6B7280" : "#4B5563",
              color: "#F3F4F6",
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: "#F3F4F6",
            }),
          }}
        />
        {errors.physicianId && (
          <p className="mt-1 text-sm text-red-500">{errors.physicianId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Test Types
        </label>
        <Select
          value={formData.testTypes}
          onChange={(selected) => handleInputChange("testTypes", selected)}
          isMulti
          options={testTypes}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#4B5563",
              borderColor: errors.testTypes ? "#EF4444" : "#6B7280",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#4B5563",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused ? "#6B7280" : "#4B5563",
              color: "#F3F4F6",
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#6B7280",
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: "#F3F4F6",
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              color: "#F3F4F6",
              ":hover": {
                backgroundColor: "#4B5563",
                color: "#F3F4F6",
              },
            }),
          }}
        />
        {errors.testTypes && (
          <p className="mt-1 text-sm text-red-500">{errors.testTypes}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sample References
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formData.samples.map((sample, index) => (
            <div key={index} className="relative">
              <TextInput
                id={`sample-${index}`}
                label=""
                type="text"
                value={sample}
                onChange={(e) => handleSampleChange(index, e.target.value)}
                placeholder={`Sample ${index + 1}`}
                error={index === 0 ? errors.samples : undefined}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSampleInput(index)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                  aria-label="Remove sample"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center">
          <button
            type="button"
            onClick={addSampleInput}
            className="p-2 bg-indigo-600 text-white rounded flex items-center hover:bg-indigo-700 transition duration-150 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={formData.samples.length >= MAX_SAMPLES}
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Add Sample
          </button>
          {formData.samples.length >= MAX_SAMPLES && (
            <span className="ml-4 text-yellow-500 text-sm">
              Maximum of {MAX_SAMPLES} samples reached
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out disabled:bg-green-400 disabled:cursor-not-allowed"
        disabled={isPosting}
      >
        {isPosting ? "Creating Requisition..." : "Create Requisition"}
      </button>

      {postError && (
        <div className="text-red-500 mt-2">
          Error creating requisition: {postError.message}
        </div>
      )}
    </form>
  );
};

export default RequisitionForm;
