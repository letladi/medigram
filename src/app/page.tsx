import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Medigram</h1>
      <p className="text-xl mb-8">Efficient Patient Management System</p>
      <Link href="/patients" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        View Patients
      </Link>
    </div>
  )
}