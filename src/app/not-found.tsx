export const dynamic = "force-dynamic"; // 👈 ADD THIS LINE AT THE TOP
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8">We could not find the page you were looking for.</p>
      <Link 
        href="/" 
        className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Return Home
      </Link>
    </div>
  )
}