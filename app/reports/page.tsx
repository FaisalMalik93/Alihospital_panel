'use client'

import { useState, useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import { formatDatePKT, formatDateTimePKT, formatPDFDatePKT } from '@/lib/dateUtils'
import Image from 'next/image'

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  contact: string
  address: string
}

interface Template {
  id: string
  name: string
  contentTemplate: string
  doctor?: { name: string; specialization: string }
}

interface Report {
  id: string
  content: string
  generatedAt: string
  patient: Patient
  template: Template
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [reportContent, setReportContent] = useState('')
  const [previewReport, setPreviewReport] = useState<Report | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReports()
    fetchPatients()
    fetchTemplates()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports')
      const data = await res.json()
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
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

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    const patient = patients.find((p) => p.id === selectedPatient)

    if (template && patient) {
      let content = template.contentTemplate
      content = content.replace(/\[PATIENT_NAME\]/g, patient.name)
      content = content.replace(/\[PATIENT_AGE\]/g, patient.age.toString())
      content = content.replace(/\[PATIENT_GENDER\]/g, patient.gender)
      content = content.replace(/\[DATE\]/g, formatDatePKT(new Date()))
      setReportContent(content)
    }
  }

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId)
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      const patient = patients.find((p) => p.id === patientId)

      if (template && patient) {
        let content = template.contentTemplate
        content = content.replace(/\[PATIENT_NAME\]/g, patient.name)
        content = content.replace(/\[PATIENT_AGE\]/g, patient.age.toString())
        content = content.replace(/\[PATIENT_GENDER\]/g, patient.gender)
        content = content.replace(/\[DATE\]/g, formatDatePKT(new Date()))
        setReportContent(content)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !selectedTemplate || !reportContent) {
      alert('Please select patient, template and fill content')
      return
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          templateId: selectedTemplate,
          content: reportContent,
        }),
      })

      if (res.ok) {
        alert('Report created successfully!')
        fetchReports()
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create report')
      }
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Failed to create report')
    }
  }

  const resetForm = () => {
    setSelectedPatient('')
    setSelectedTemplate('')
    setReportContent('')
    setShowForm(false)
  }

  const handlePrint = (report: Report) => {
    setPreviewReport(report)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleDownloadPDF = (report: Report) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    // Add header
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('ALI HOSPITAL', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Medical Report', pageWidth / 2, 30, { align: 'center' })

    // Add patient info
    doc.setFontSize(10)
    doc.text(`Patient: ${report.patient.name}`, margin, 45)
    doc.text(`Age: ${report.patient.age}  Gender: ${report.patient.gender}`, margin, 52)
    doc.text(`Contact: ${report.patient.contact}`, margin, 59)
    doc.text(`Date: ${formatDatePKT(report.generatedAt)}`, margin, 66)

    // Add horizontal line
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(margin, 72, pageWidth - margin, 72)

    // Add report content
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(report.content, maxWidth)
    doc.text(lines, margin, 82)

    // Add doctor signature if available
    if (report.template.doctor) {
      const finalY = 82 + lines.length * 5 + 20
      doc.setFontSize(10)
      doc.text(`Dr. ${report.template.doctor.name}`, pageWidth - margin, finalY, {
        align: 'right',
      })
      doc.text(report.template.doctor.specialization, pageWidth - margin, finalY + 5, {
        align: 'right',
      })
    }

    doc.save(`Report_${report.patient.name}_${formatPDFDatePKT(new Date())}.pdf`)
  }

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Patient Reports</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Generate New Report'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Patient *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={selectedPatient}
                    onChange={(e) => handlePatientSelect(e.target.value)}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.age}y {patient.gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Template *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                  >
                    <option value="">Choose a template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                        {template.doctor && ` - Dr. ${template.doctor.name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Content *
                </label>
                <div className="text-xs text-gray-500 mb-1">
                  Edit the content as needed before saving
                </div>
                <textarea
                  required
                  rows={15}
                  className="input-field font-mono text-sm"
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Save Report
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Reports History</h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports found. Generate one to get started!</p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {report.patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Template: {report.template.name} | Date:{' '}
                        {formatDateTimePKT(report.generatedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePrint(report)}
                        className="btn-secondary text-sm"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(report)}
                        className="btn-primary text-sm"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap max-h-40 overflow-auto">
                    {report.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Print view */}
      {previewReport && (
        <div className="hidden print:block">
          <div className="p-6" ref={printRef}>
            <div className="text-center mb-4">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.jpg"
                  alt="Ali Hospital Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-blue-700">ALI HOSPITAL</h1>
              <p className="text-lg">Medical Report</p>
            </div>

            <div className="mb-6 space-y-1">
              <p>
                <strong>Patient Name:</strong> {previewReport.patient.name}
              </p>
              <p>
                <strong>Age:</strong> {previewReport.patient.age} |{' '}
                <strong>Gender:</strong> {previewReport.patient.gender}
              </p>
              <p>
                <strong>Contact:</strong> {previewReport.patient.contact}
              </p>
              <p>
                <strong>Address:</strong> {previewReport.patient.address}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {formatDatePKT(previewReport.generatedAt)}
              </p>
            </div>

            <hr className="my-6 border-gray-400" />

            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {previewReport.content}
            </div>

            {previewReport.template.doctor && (
              <div className="mt-16 text-right">
                <p className="font-semibold">Dr. {previewReport.template.doctor.name}</p>
                <p>{previewReport.template.doctor.specialization}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
