'use client'

import { useState, useEffect } from 'react'
import { formatDatePKT, formatTimePKT } from '@/lib/dateUtils'

interface Doctor {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
}

interface Payment {
  id: string
  amount: number
  date: string
  notes: string
  createdAt: string
  doctor: Doctor
}

export default function DoctorPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [formData, setFormData] = useState({
    doctorId: '',
    amount: '',
    notes: '',
  })

  useEffect(() => {
    fetchPayments()
    fetchDoctors()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/doctor-payments')
      const data = await res.json()
      setPayments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors')
      const data = await res.json()
      setDoctors(data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/doctor-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchPayments()
        resetForm()
        alert('Payment recorded successfully!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Error recording payment:', error)
      alert('Failed to record payment')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return

    try {
      const res = await fetch(`/api/doctor-payments/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchPayments()
        alert('Payment deleted successfully!')
      } else {
        alert('Failed to delete payment')
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
      alert('Failed to delete payment')
    }
  }

  const resetForm = () => {
    setFormData({
      doctorId: '',
      amount: '',
      notes: '',
    })
    setShowForm(false)
  }

  // Calculate doctor-wise summary
  const getDoctorSummary = () => {
    const summary: { [key: string]: { doctor: Doctor; totalPaid: number; paymentCount: number } } = {}

    payments.forEach((payment) => {
      if (!summary[payment.doctor.id]) {
        summary[payment.doctor.id] = {
          doctor: payment.doctor,
          totalPaid: 0,
          paymentCount: 0,
        }
      }
      summary[payment.doctor.id].totalPaid += payment.amount
      summary[payment.doctor.id].paymentCount += 1
    })

    return Object.values(summary)
  }

  const doctorSummary = getDoctorSummary()

  // Filter payments for selected doctor
  const filteredPayments = selectedDoctor
    ? payments.filter((p) => p.doctor.id === selectedDoctor)
    : payments

  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Payments</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctorSummary.map((summary) => (
            <div key={summary.doctor.id} className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{summary.doctor.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{summary.doctor.specialization}</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary-600">
                  Rs. {summary.totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  Total Paid ({summary.paymentCount} payment{summary.paymentCount !== 1 ? 's' : ''})
                </p>
              </div>
              <button
                onClick={() => setSelectedDoctor(summary.doctor.id)}
                className="mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                View Payment History →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Record Payment Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Record New Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Doctor *
              </label>
              <select
                required
                className="input-field"
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorId: e.target.value })
                }
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount (Rs.) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="10000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="input-field"
                placeholder="Payment for consultation services, period, etc."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Record Payment
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment History
            {selectedDoctor && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {payments.find(p => p.doctor.id === selectedDoctor)?.doctor.name}
              </span>
            )}
          </h2>
          {selectedDoctor && (
            <button
              onClick={() => setSelectedDoctor('')}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Show All Doctors
            </button>
          )}
        </div>

        {selectedDoctor && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Total Paid to this Doctor:</strong> Rs. {totalPayments.toLocaleString()}
            </p>
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredPayments.length === 0 ? (
          <p className="text-gray-600">
            {selectedDoctor
              ? 'No payments found for this doctor.'
              : 'No payments recorded yet. Record one to get started!'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDatePKT(payment.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimePKT(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.doctor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.doctor.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">
                        Rs. {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {payment.notes || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(payment.id)}
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

        {!selectedDoctor && filteredPayments.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900">
              Grand Total Payments: Rs. {totalPayments.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
