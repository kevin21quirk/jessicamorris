import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { X, Upload, FileText, AlertCircle } from 'lucide-react'

const DocumentUpload = ({ taskId, onClose }) => {
  const { addDocument } = useTaskContext()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    selectedFiles.forEach(file => {
      const document = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        file: file
      }
      addDocument(taskId, document)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 bg-primary-300">
          <h2 className="text-3xl font-bold text-gray-800">Upload Documents</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragging 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400'
              }
            `}
          >
            <Upload className={`mx-auto mb-4 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} size={48} />
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Support for PDF, DOC, DOCX, XLS, XLSX, images, and more
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 cursor-pointer transition-all font-semibold shadow-lg"
            >
              <Upload size={20} />
              Browse Files
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Selected Files ({selectedFiles.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="text-gray-500 flex-shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-primary-800">
              Documents are stored locally in your browser. They will be associated with this task and can be viewed from the Documents page.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
              className="px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentUpload
