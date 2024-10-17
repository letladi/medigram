"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModal } from "./ModalProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { setIsModalOpen } = useModal();

  const getAddButtonText = () => {
    switch (pathname) {
      case "/patients":
        return "Add Patient";
      case "/physicians":
        return "Add Physician";
      default:
        return "";
    }
  };

  const addBtnText = getAddButtonText();

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Medigram
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/patients"
                className={`${
                  pathname === "/patients"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Patients
              </Link>
              <Link
                href="/physicians"
                className={`${
                  pathname === "/physicians"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Physicians
              </Link>
            </div>
          </div>
          {addBtnText ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {getAddButtonText()}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
}
