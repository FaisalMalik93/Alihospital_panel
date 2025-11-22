import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/auth'
import LogoutButton from './components/LogoutButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ali Hospital Management System',
  description: 'Hospital Management System for Ali Hospital',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 print:bg-white">
          <nav className="bg-white shadow-md print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link href="/" className="flex items-center space-x-3">
                    <Image
                      src="/logo.jpg"
                      alt="Ali Hospital Logo"
                      width={60}
                      height={60}
                      priority
                      className="object-contain"
                    />
                  </Link>
                  {session && (
                    <div className="hidden md:ml-10 md:flex md:space-x-8">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/doctors"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Doctors
                      </Link>
                      <Link
                        href="/patients"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Patients
                      </Link>
                      <Link
                        href="/templates"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Templates
                      </Link>
                      <Link
                        href="/reports"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Reports
                      </Link>
                      <Link
                        href="/bills"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        Billing
                      </Link>
                      {session.role === 'Admin' && (
                        <Link
                          href="/doctor-payments"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                        >
                          Doctor Payments
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                {session && (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-700">
                        {session.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {session.role}
                      </span>
                    </div>
                    <LogoutButton />
                  </div>
                )}
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
