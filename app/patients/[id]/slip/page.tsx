'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { formatDatePKT } from '@/lib/dateUtils'
import Image from 'next/image'

interface Patient {
  id: string
  patientId: string
  mrId: string | null
  name: string
  age: number
  gender: string
  contact: string
  address: string
  medicalHistory: string
  createdAt: string
}

export default function PatientSlipPage() {
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPatient(params.id as string)
    }
  }, [params.id])

  const fetchPatient = async (id: string) => {
    try {
      const res = await fetch(`/api/patients/${id}`)
      const data = await res.json()
      setPatient(data)
    } catch (error) {
      console.error('Error fetching patient:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!patient) {
    return <div className="p-8">Patient not found</div>
  }

  return (
    <div>
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden p-4 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Patient Detail Slip</h1>
        <button onClick={handlePrint} className="btn-primary">
          Print Slip
        </button>
      </div>

      {/* Printable Slip */}
      <div className="max-w-4xl mx-auto p-6 bg-white">
        {/* Hospital Header */}
        <div className="flex items-center justify-center gap-3 mb-4 pb-3 border-b-2 border-blue-600">
          <Image
            src="/logo.jpg"
            alt="Ali Hospital Logo"
            width={70}
            height={70}
            className="object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-700">ALI HOSPITAL</h1>
            <p className="text-xs text-gray-600">Comprehensive Healthcare Services - Pakistan</p>
          </div>
        </div>

        {/* Patient Information Header */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-24">MR #:</span>
              <span className="border-b border-gray-400 flex-1 px-2">
                {patient.mrId || 'N/A'}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Patient:</span>
              <span className="border-b border-gray-400 flex-1 px-2 font-bold">
                {patient.name}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Age/Sex:</span>
              <span className="border-b border-gray-400 flex-1 px-2">
                {patient.age} / {patient.gender}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-24">Visit ID:</span>
              <span className="border-b border-gray-400 flex-1 px-2">
                {patient.patientId}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Date:</span>
              <span className="border-b border-gray-400 flex-1 px-2">
                {formatDatePKT(patient.createdAt)}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Contact:</span>
              <span className="border-b border-gray-400 flex-1 px-2">
                {patient.contact}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-3 text-sm">
          <div className="flex">
            <span className="font-semibold w-24">Address:</span>
            <span className="border-b border-gray-400 flex-1 px-2">
              {patient.address}
            </span>
          </div>
        </div>

        {/* Medical History */}
        {patient.medicalHistory && (
          <div className="mb-3 text-sm">
            <div className="font-semibold mb-1">Medical History:</div>
            <div className="border border-gray-300 rounded p-2 min-h-[60px] bg-gray-50 text-xs">
              {patient.medicalHistory}
            </div>
          </div>
        )}

        {/* Vitals Section */}
        <div className="mb-3 border border-gray-300 rounded p-3">
          <h3 className="font-semibold text-sm mb-2 border-b pb-1">VITALS:</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex">
              <span className="font-medium">BP:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
            <div className="flex">
              <span className="font-medium">Pulse:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
            <div className="flex">
              <span className="font-medium">Temp:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
            <div className="flex">
              <span className="font-medium">Weight:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
            <div className="flex">
              <span className="font-medium">Height:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
            <div className="flex">
              <span className="font-medium">O2 Sat:</span>
              <span className="border-b border-gray-400 flex-1 ml-2"></span>
            </div>
          </div>
        </div>

        {/* Prescription/Notes Section */}
        <div className="mb-6 border border-gray-300 rounded p-4">
          <h3 className="font-semibold text-sm mb-3 border-b pb-2">Rx / NOTES:</h3>
          <div className="space-y-3">
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
            <div className="border-b border-gray-300 h-8"></div>
          </div>
        </div>

        {/* Doctor Signature */}
        <div className="mt-8 flex justify-end">
          <div className="text-center">
            <div className="border-t border-gray-400 w-48 mb-2"></div>
            <p className="text-sm font-semibold">Doctor's Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
          <p>Ali Hospital - Quality Healthcare for All</p>
          <p className="mt-1">This is a computer-generated slip</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  )
}
