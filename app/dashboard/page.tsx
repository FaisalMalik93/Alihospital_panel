'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatLongDatePKT, formatTimePKT } from '@/lib/dateUtils'

interface DashboardStats {
  todayPatients: number
  todayBills: number
  todayRevenue: number
  totalPatients: number
  totalDoctors: number
  unpaidBills: number
}

interface TodayPatient {
  id: string
  patientId: string
  name: string
  age: number
  gender: string
  contact: string
  createdAt: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayPatients: 0,
    todayBills: 0,
    todayRevenue: 0,
    totalPatients: 0,
    totalDoctors: 0,
    unpaidBills: 0,
  })
  const [todayPatients, setTodayPatients] = useState<TodayPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data
      const [patientsRes, billsRes, doctorsRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/bills'),
        fetch('/api/doctors'),
      ])

      const patients = await patientsRes.json()
      const bills = await billsRes.json()
      const doctors = await doctorsRes.json()

      // Get today's date in PKT (Pakistan Standard Time)
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

      // Filter today's patients
      const todayPatientsData = patients.filter((p: TodayPatient) => {
        const patientDate = new Date(p.createdAt)
        return patientDate >= todayStart
      })

      // Filter today's bills
      const todayBillsData = bills.filter((b: any) => {
        const billDate = new Date(b.createdAt)
        return billDate >= todayStart
      })

      // Calculate today's revenue
      const todayRevenue = todayBillsData
        .filter((b: any) => b.status === 'paid')
        .reduce((sum: number, b: any) => sum + b.amount, 0)

      // Count unpaid bills
      const unpaidCount = bills.filter((b: any) => b.status === 'unpaid').length

      setStats({
        todayPatients: todayPatientsData.length,
        todayBills: todayBillsData.length,
        todayRevenue,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        unpaidBills: unpaidCount,
      })

      setTodayPatients(todayPatientsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Today: {formatLongDatePKT(new Date())} (PKT)
        </p>
      </div>

      {/* Today's Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Patients Registered Today</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.todayPatients}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Bills Created Today</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.todayBills}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Today's Revenue</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  Rs. {stats.todayRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Patients List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Patients Registered Today ({stats.todayPatients})
          </h2>
          <Link href="/patients" className="text-sm text-primary-600 hover:text-primary-900">
            View All Patients →
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : todayPatients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No patients registered today yet.</p>
            <Link href="/patients" className="btn-primary mt-4 inline-block">
              Register New Patient
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Age/Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time Registered
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-primary-600">
                        {patient.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {patient.age} / {patient.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{patient.contact}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatTimePKT(patient.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overall Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
              </div>
              <div className="text-blue-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</p>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unpaid Bills</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{stats.unpaidBills}</p>
              </div>
              <div className="text-red-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/patients" className="btn-primary text-center">
            Add Patient
          </Link>
          <Link href="/reports" className="btn-primary text-center">
            Generate Report
          </Link>
          <Link href="/bills" className="btn-primary text-center">
            Create Bill
          </Link>
          <Link href="/doctor-payments" className="btn-primary text-center">
            Doctor Payments
          </Link>
        </div>
      </div>
    </div>
  )
}
