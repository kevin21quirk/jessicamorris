import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { FileText, Search, Download, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

const Documents = () => {
  const { tasks } = useTaskContext()
  const [searchTerm, setSearchTerm] = useState('')

  const allDocuments = tasks.flatMap(task => 
    (task.documents || []).map(doc => ({
      ...doc,
      taskId: task.id,
      taskTitle: task.title,
      assignedTo: task.assignedTo
    }))
  )

  const filteredDocuments = allDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.taskTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    const colors = {
      pdf: 'text-red-600 bg-red-50',
      doc: 'text-primary-600 bg-primary-50',
      docx: 'text-primary-600 bg-primary-50',
      xls: 'text-green-600 bg-green-50',
      xlsx: 'text-green-600 bg-green-50',
      jpg: 'text-purple-600 bg-purple-50',
      jpeg: 'text-purple-600 bg-purple-50',
      png: 'text-purple-600 bg-purple-50',
      txt: 'text-gray-600 bg-gray-50',
    }
    return colors[ext] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <h1 className="text-5xl font-bold tracking-tight">Documents</h1>
        <p className="text-xl mt-3 text-gray-700 font-medium">All uploaded documents across tasks</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 font-medium text-lg">
            {allDocuments.length === 0 
              ? 'No documents uploaded yet. Upload documents from the Tasks page.'
              : 'No documents match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc, idx) => (
                  <tr className="hover:bg-gradient-to-r hover:from-pink-50/30 hover:to-gold-50/30 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getFileIcon(doc.name)}`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{doc.taskTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100 to-gold-100 text-primary-800 border border-primary-200">
                        {doc.assignedTo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{(doc.size / 1024).toFixed(1)} KB</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const url = URL.createObjectURL(doc.file)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = doc.name
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Download"
                        >
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-800">
          <strong>Note:</strong> Documents are stored locally in your browser. To upload documents, go to the Tasks page and use the upload option for each task.
        </p>
      </div>
    </div>
  )
}

export default Documents
