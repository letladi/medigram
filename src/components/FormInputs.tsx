import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface InputProps {
  id: string;
  label: string;
  type: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const TextInput: React.FC<InputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
  icon,
  error,
}) => (
  <div className="w-full">
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}{" "}
        {error && (
          <span className="mt-1 ml-4 text-sm text-red-500">{error}</span>
        )}
      </label>
    )}
    <div className="relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={clsx(
          `block w-full rounded-md border-0 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 
          sm:text-sm h-10`,
          icon ? "pl-10" : "pl-3",
          "pr-3",
        )}
      />
    </div>
  </div>
);

interface FileInputProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  error?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  onChange,
  previewUrl,
  error,
}) => (
  <div className="mb-4">
    <div className="flex items-center">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-32 h-32 rounded-full object-cover mr-4 border-2 border-indigo-500"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center mr-4">
          <PhotoIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <label
        htmlFor={id}
        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
      >
        Choose file
        <input type="file" id={id} onChange={onChange} className="hidden" />
      </label>
      {error && <span className="text-red-500 ml-4">(avatar {error})</span>}
    </div>
  </div>
);

export const SearchInput: React.FC<InputProps> = (props) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon
        className="h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
    </div>
    <input
      {...props}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);
