'use client'

import { useState, useEffect } from 'react'

interface Template {
  id: string
  name: string
  contentTemplate: string
  doctorId?: string
  doctor?: { name: string }
}

interface Doctor {
  id: string
  name: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contentTemplate: '',
    doctorId: '',
  })

  useEffect(() => {
    fetchTemplates()
    fetchDoctors()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
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
      const url = editingTemplate
        ? `/api/templates/${editingTemplate.id}`
        : '/api/templates'
      const method = editingTemplate ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchTemplates()
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    }
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      contentTemplate: template.contentTemplate,
      doctorId: template.doctorId || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchTemplates()
      } else {
        alert('Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contentTemplate: '',
      doctorId: '',
    })
    setEditingTemplate(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Report Templates</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Create Template'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Doctor (Optional)</label>
              <select
                className="input-field"
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorId: e.target.value })
                }
              >
                <option value="">None (General Template)</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Content *
              </label>
              <div className="text-xs text-gray-500 mb-1">
                Use [PATIENT_NAME], [PATIENT_AGE], [PATIENT_GENDER], [DATE] as placeholders
              </div>
              <textarea
                required
                rows={12}
                className="input-field font-mono text-sm"
                placeholder="Example:&#10;&#10;MEDICAL REPORT&#10;&#10;Patient Name: [PATIENT_NAME]&#10;Age: [PATIENT_AGE] Gender: [PATIENT_GENDER]&#10;Date: [DATE]&#10;&#10;Findings:&#10;&#10;Diagnosis:&#10;&#10;Treatment Plan:"
                value={formData.contentTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, contentTemplate: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Templates List</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : templates.length === 0 ? (
          <p className="text-gray-600">No templates found. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{template.name}</h3>
                {template.doctor && (
                  <p className="text-sm text-gray-600 mb-2">Doctor: {template.doctor.name}</p>
                )}
                <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded mb-3 whitespace-pre-wrap overflow-auto max-h-40">
                  {template.contentTemplate}
                </pre>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-sm text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
