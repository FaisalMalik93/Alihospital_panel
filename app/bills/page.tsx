'use client'

import { useState, useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import { formatDatePKT, formatTimePKT, formatDateTimePKT, formatPDFDatePKT } from '@/lib/dateUtils'
import Image from 'next/image'

interface Patient {
  id: string
  patientId: string
  name: string
  contact: string
  address: string
}

interface Bill {
  id: string
  services: string
  amount: number
  status: string
  date: string
  createdAt: string
  patient: Patient
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [printingBill, setPrintingBill] = useState<Bill | null>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    services: '',
    amount: '',
    status: 'unpaid',
  })

  useEffect(() => {
    fetchBills()
    fetchPatients()
  }, [])

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills')
      const data = await res.json()
      setBills(data)
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      setPatients(data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchBills()
        resetForm()
        alert('Bill created successfully!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create bill')
      }
    } catch (error) {
      console.error('Error creating bill:', error)
      alert('Failed to create bill')
    }
  }

  const handleStatusUpdate = async (billId: string, newStatus: string) => {
    try {
      const bill = bills.find((b) => b.id === billId)
      if (!bill) return

      const res = await fetch(`/api/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: bill.services,
          amount: bill.amount,
          status: newStatus,
        }),
      })

      if (res.ok) {
        fetchBills()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return

    try {
      const res = await fetch(`/api/bills/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchBills()
        alert('Bill deleted successfully!')
      } else {
        alert('Failed to delete bill')
      }
    } catch (error) {
      console.error('Error deleting bill:', error)
      alert('Failed to delete bill')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      services: '',
      amount: '',
      status: 'unpaid',
    })
    setShowForm(false)
  }

  const handlePrintInvoice = (bill: Bill) => {
    setPrintingBill(bill)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleDownloadPDF = (bill: Bill) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('ALI HOSPITAL', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Pakistan', pageWidth / 2, 28, { align: 'center' })

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', pageWidth / 2, 40, { align: 'center' })

    // Line
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(margin, 45, pageWidth - margin, 45)

    // Invoice details
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice Date: ${formatDateTimePKT(bill.createdAt)}`, margin, 55)
    doc.text(`Patient ID: ${bill.patient.patientId}`, pageWidth - margin, 55, { align: 'right' })

    // Patient Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Patient Information:', margin, 68)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${bill.patient.name}`, margin, 76)
    doc.text(`Contact: ${bill.patient.contact}`, margin, 83)
    doc.text(`Address: ${bill.patient.address}`, margin, 90)

    // Line
    doc.line(margin, 98, pageWidth - margin, 98)

    // Services
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Services & Charges:', margin, 108)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const services = bill.services.split('\n')
    let yPos = 118
    services.forEach((service) => {
      if (service.trim()) {
        doc.text(service, margin + 5, yPos)
        yPos += 7
      }
    })

    // Line before total
    doc.line(margin, yPos + 5, pageWidth - margin, yPos + 5)

    // Total Amount
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Amount: Rs. ${bill.amount.toLocaleString()}`, pageWidth - margin, yPos + 15, { align: 'right' })

    // Payment Status
    doc.setFontSize(11)
    const statusColor = bill.status === 'paid' ? [34, 197, 94] : bill.status === 'unpaid' ? [239, 68, 68] : [234, 179, 8]
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
    doc.text(`Status: ${bill.status.toUpperCase()}`, margin, yPos + 15)
    doc.setTextColor(0, 0, 0)

    // Footer
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text('Thank you for choosing Ali Hospital', pageWidth / 2, yPos + 35, { align: 'center' })
    doc.text('For queries, please contact hospital reception', pageWidth / 2, yPos + 41, { align: 'center' })

    doc.save(`Invoice_${bill.patient.patientId}_${formatPDFDatePKT(new Date())}.pdf`)
  }

  const totalUnpaid = bills
    .filter((b) => b.status === 'unpaid')
    .reduce((sum, b) => sum + b.amount, 0)

  const totalPaid = bills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0)

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Bill'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-red-50 border border-red-200">
            <h3 className="text-sm font-medium text-red-800 mb-1">Unpaid Bills</h3>
            <p className="text-2xl font-bold text-red-600">Rs. {totalUnpaid.toLocaleString()}</p>
          </div>
          <div className="card bg-green-50 border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-1">Paid Bills</h3>
            <p className="text-2xl font-bold text-green-600">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Bills</h3>
            <p className="text-2xl font-bold text-blue-600">Rs. {(totalUnpaid + totalPaid).toLocaleString()}</p>
          </div>
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Create New Bill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Patient *
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.patientId} - {patient.name} - {patient.contact}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services/Items *
                </label>
                <textarea
                  required
                  rows={6}
                  className="input-field font-mono text-sm"
                  placeholder="Example:&#10;- Consultation Fee (General Physician): Rs. 1,500&#10;- X-Ray (Chest PA): Rs. 1,200&#10;- Complete Blood Count (CBC): Rs. 800&#10;- Medicines: Rs. 2,200"
                  value={formData.services}
                  onChange={(e) =>
                    setFormData({ ...formData, services: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="5000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Create Bill
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Bills List</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : bills.length === 0 ? (
            <p className="text-gray-600">No bills found. Create one to get started!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDatePKT(bill.createdAt)}</div>
                        <div className="text-xs text-gray-500">{formatTimePKT(bill.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bill.patient.name}
                        </div>
                        <div className="text-xs text-gray-500">{bill.patient.patientId}</div>
                        <div className="text-xs text-gray-500">{bill.patient.contact}</div>
                      </td>
                      <td className="px-6 py-4">
                        <pre className="text-xs text-gray-900 whitespace-pre-wrap max-w-xs">
                          {bill.services}
                        </pre>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        Rs. {bill.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`text-sm px-3 py-1 rounded-full font-medium border-0 ${
                            bill.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : bill.status === 'unpaid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          value={bill.status}
                          onChange={(e) => handleStatusUpdate(bill.id, e.target.value)}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                          <option value="partial">Partial</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handlePrintInvoice(bill)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(bill)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Printable Invoice */}
      {printingBill && (
        <div className="hidden print:block">
          <div className="p-6" ref={printRef}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-600">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="Ali Hospital Logo"
                  width={70}
                  height={70}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold text-blue-700">ALI HOSPITAL</h1>
                  <p className="text-sm text-gray-600">Pakistan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-blue-700">INVOICE</p>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Invoice Date:</p>
                <p className="font-semibold">{formatDateTimePKT(printingBill.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Patient ID:</p>
                <p className="font-semibold">{printingBill.patient.patientId}</p>
              </div>
            </div>

            <hr className="my-3 border-gray-300" />

            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2">Patient Information:</h3>
              <div className="text-sm space-y-1">
                <p><strong>Name:</strong> {printingBill.patient.name}</p>
                <p><strong>Contact:</strong> {printingBill.patient.contact}</p>
                <p><strong>Address:</strong> {printingBill.patient.address}</p>
              </div>
            </div>

            <hr className="my-3 border-gray-300" />

            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2">Services & Charges:</h3>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {printingBill.services}
              </pre>
            </div>

            <hr className="my-3 border-gray-300" />

            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Payment Status:</p>
                <p className={`text-lg font-bold ${
                  printingBill.status === 'paid' ? 'text-green-600' :
                  printingBill.status === 'unpaid' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {printingBill.status.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount:</p>
                <p className="text-2xl font-bold">Rs. {printingBill.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
              <p>Thank you for choosing Ali Hospital</p>
              <p className="mt-1">For queries, please contact hospital reception</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
