import React, { useState } from 'react'
import { X, Calendar, User, Flag, FileText, Upload, MessageSquare, Clock, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { useTaskContext } from '../context/TaskContext'
import { useEmailContext } from '../context/EmailContext'

const TaskDetailView = ({ task, onClose }) => {
  const { updateTask, addDocument, addTimelineEntry } = useTaskContext()
  const { addEmail } = useEmailContext()
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailData, setEmailData] = useState({
    from: '',
    to: task.assignedTo || 'Jessica Morris',
    subject: '',
    body: '',
    direction: 'received',
    status: 'pending'
  })
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  })

  const handleUpdate = () => {
    const changes = []
    if (formData.title !== task.title) changes.push(`Title changed to "${formData.title}"`)
    if (formData.description !== task.description) changes.push('Description updated')
    if (formData.status !== task.status) changes.push(`Status changed to ${formData.status}`)
    if (formData.priority !== task.priority) changes.push(`Priority changed to ${formData.priority}`)
    if (formData.assignedTo !== task.assignedTo) changes.push(`Assigned to ${formData.assignedTo}`)
    if (formData.dueDate !== (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')) {
      changes.push('Due date updated')
    }

    const timelineMessage = changes.length > 0 ? changes.join(', ') : null

    updateTask(task.id, {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }, timelineMessage)
    
    setIsEditing(false)
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addTimelineEntry(task.id, {
        type: 'note',
        message: newNote,
        user: 'Admin'
      })
      setNewNote('')
    }
  }

  const handleLogEmail = () => {
    if (emailData.from && emailData.subject) {
      // Add email to email log
      addEmail({
        ...emailData,
        relatedTask: task.id,
        relatedTaskTitle: task.title
      })
      
      // Add timeline entry to task
      addTimelineEntry(task.id, {
        type: 'email',
        message: `Email logged: "${emailData.subject}" from ${emailData.from}`,
        user: 'Admin'
      })
      
      // Reset form
      setEmailData({
        from: '',
        to: task.assignedTo || 'Jessica Morris',
        subject: '',
        body: '',
        direction: 'received',
        status: 'pending'
      })
      setShowEmailForm(false)
    }
  }

  const handleFileSelect = (e) => {
    setSelectedFiles([...e.target.files])
  }

  const handleUploadDocuments = () => {
    selectedFiles.forEach(file => {
      const document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        taskId: task.id,
        taskTitle: task.title,
        assignedTo: task.assignedTo,
        file: file
      }
      addDocument(task.id, document)
    })
    setSelectedFiles([])
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100 border-red-300'
      case 'medium': return 'text-gold-700 bg-gold-100 border-gold-300'
      case 'low': return 'text-green-700 bg-green-100 border-green-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-300'
      case 'in-progress': return 'text-primary-700 bg-primary-100 border-primary-300'
      case 'pending': return 'text-gold-700 bg-gold-100 border-gold-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'created': return <CheckCircle2 size={16} className="text-green-600" />
      case 'update': return <AlertCircle size={16} className="text-primary-600" />
      case 'document': return <FileText size={16} className="text-gold-600" />
      case 'note': return <MessageSquare size={16} className="text-blue-600" />
      case 'email': return <Mail size={16} className="text-purple-600" />
      default: return <Clock size={16} className="text-gray-600" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-primary-300 p-6 flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-3xl font-bold bg-white/20 text-gray-800 px-3 py-1 rounded-lg w-full"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-semibold"
                    >
                      Edit Task
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            title: task.title,
                            description: task.description,
                            status: task.status,
                            priority: task.priority,
                            assignedTo: task.assignedTo,
                            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
                          })
                          setIsEditing(false)
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {isEditing ? (
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add task description..."
                      />
                    ) : (
                      <p className="text-gray-600">{task.description || 'No description provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      {isEditing ? (
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                      {isEditing ? (
                        <select
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Jessica">Jessica</option>
                          <option value="Kevin">Kevin</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium">{task.assignedTo}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                
                <div className="space-y-4">
                  {task.documents && task.documents.length > 0 && (
                    <div className="space-y-2">
                      {task.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-primary-600" />
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {(doc.size / 1024).toFixed(1)} KB • {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Select files to upload'}
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload-detail"
                    />
                    <label
                      htmlFor="file-upload-detail"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 cursor-pointer transition-all font-semibold"
                    >
                      <Upload size={18} />
                      Browse Files
                    </label>
                    {selectedFiles.length > 0 && (
                      <button
                        onClick={handleUploadDocuments}
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
                      >
                        Upload {selectedFiles.length} file(s)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Log Email</h2>
                  <button
                    onClick={() => setShowEmailForm(!showEmailForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-white rounded-lg hover:bg-gold-500 transition-all font-semibold"
                  >
                    <Mail size={18} />
                    {showEmailForm ? 'Hide Form' : 'Add Email'}
                  </button>
                </div>
                
                {showEmailForm && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                        <input
                          type="text"
                          value={emailData.from}
                          onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="sender@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                        <input
                          type="text"
                          value={emailData.to}
                          onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="recipient@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Email subject"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Email content..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                        <select
                          value={emailData.direction}
                          onChange={(e) => setEmailData({ ...emailData, direction: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="received">Received</option>
                          <option value="sent">Sent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={emailData.status}
                          onChange={(e) => setEmailData({ ...emailData, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="responded">Responded</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogEmail}
                      disabled={!emailData.from || !emailData.subject}
                      className="w-full px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Log Email & Add to Timeline
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Note</h2>
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add a note or update..."
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-0">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
                <div className="space-y-4">
                  {task.timeline && task.timeline.length > 0 ? (
                    [...task.timeline].reverse().map((entry) => (
                      <div key={entry.id} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTimelineIcon(entry.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{entry.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.user} • {format(new Date(entry.timestamp), 'MMM dd, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No activity yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailView
