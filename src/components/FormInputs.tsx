import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface InputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
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
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
    </label>
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
        className={`block w-full rounded-md border-0 bg-gray-700 text-gray-100 placeholder-gray-400
                    focus:ring-2 focus:ring-indigo-500 sm:text-sm
                    ${icon ? "pl-10" : "pl-4"} pr-4 py-3
                    transition duration-150 ease-in-out
                    hover:bg-gray-600 focus:bg-gray-600`}
      />
    </div>
  </div>
);

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const SelectInput: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full rounded-md border-0 bg-gray-700 text-gray-100
                focus:ring-2 focus:ring-indigo-500 sm:text-sm
                pl-4 pr-8 py-3
                transition duration-150 ease-in-out
                hover:bg-gray-600 focus:bg-gray-600
                appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: `right 0.5rem center`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `1.5em 1.5em`,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface FileInputProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  onChange,
  previewUrl,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
    </label>
    <div className="flex items-center">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-indigo-500"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mr-4">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <label
        htmlFor={id}
        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
      >
        Choose file
        <input type="file" id={id} onChange={onChange} className="hidden" />
      </label>
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
      type="text"
      {...props}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);
