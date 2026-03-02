import React, { useState } from 'react'
import { useEmailContext } from '../context/EmailContext'
import { Plus, Search, Mail, Send, Inbox, Edit2, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'

const Emails = () => {
  const { emails, addEmail, updateEmail, deleteEmail } = useEmailContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmail, setEditingEmail] = useState(null)
  const [formData, setFormData] = useState({
    subject: '',
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    direction: 'received',
    status: 'pending'
  })

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingEmail) {
      updateEmail(editingEmail.id, formData)
    } else {
      addEmail(formData)
    }
    setIsModalOpen(false)
    setEditingEmail(null)
    setFormData({ subject: '', from: '', to: '', date: new Date().toISOString().split('T')[0], summary: '', direction: 'received', status: 'pending' })
  }

  const handleEdit = (email) => {
    setEditingEmail(email)
    setFormData({
      subject: email.subject,
      from: email.from,
      to: email.to,
      date: email.date,
      summary: email.summary || '',
      direction: email.direction,
      status: email.status
    })
    setIsModalOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-700 border-green-300'
      case 'pending': return 'bg-gold-100 text-gold-700 border-gold-300'
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-primary-100 text-primary-700 border-primary-300'
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Email Log</h1>
            <p className="text-xl mt-3 text-gray-700 font-medium">Track important correspondence and communications</p>
          </div>
          <button
            onClick={() => {
              setEditingEmail(null)
              setFormData({ subject: '', from: '', to: '', date: new Date().toISOString().split('T')[0], summary: '', direction: 'received', status: 'pending' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-300 shadow-lg"
          >
            <Plus size={22} />
            Log Email
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredEmails.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
          <p className="text-gray-500 font-medium text-lg">No emails logged</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmails.map(email => (
            <div key={email.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {email.direction === 'sent' ? (
                      <Send size={20} className="text-primary-600" />
                    ) : (
                      <Inbox size={20} className="text-gold-600" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{email.subject}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(email.status)}`}>
                      {email.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">From:</span> {email.from}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {email.to}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {format(new Date(email.date), 'MMM dd, yyyy')}
                    </div>
                    <div>
                      <span className="font-medium">Direction:</span> {email.direction === 'sent' ? 'Sent' : 'Received'}
                    </div>
                  </div>
                  {email.summary && (
                    <p className="text-gray-700 mt-2">{email.summary}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(email)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteEmail(email.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 bg-primary-300">
              <h2 className="text-3xl font-bold text-gray-800">
                {editingEmail ? 'Edit Email Log' : 'Log New Email'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingEmail(null)
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From *</label>
                  <input
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
                  <input
                    type="text"
                    required
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                  <select
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="received">Received</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending Response</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Summary/Notes</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief summary of the email content..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingEmail(null)
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg"
                >
                  {editingEmail ? 'Update Email' : 'Log Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emails
