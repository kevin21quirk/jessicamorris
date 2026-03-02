import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Upload,
  FileText,
  X
} from 'lucide-react'
import { format, isPast } from 'date-fns'
import TaskModal from '../components/TaskModal'
import DocumentUpload from '../components/DocumentUpload'
import TaskDetailView from '../components/TaskDetailView'

const Tasks = () => {
  const { tasks, updateTask, deleteTask, addDocument } = useTaskContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [uploadingTaskId, setUploadingTaskId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee
    return matchesSearch && matchesStatus && matchesAssignee
  })

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
    setActiveMenu(null)
  }

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
    }
    setActiveMenu(null)
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setActiveMenu(null)
  }

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-gradient-to-r from-red-100 to-red-50 border-red-300'
      case 'medium': return 'text-gold-700 bg-gradient-to-r from-gold-100 to-gold-50 border-gold-300'
      case 'low': return 'text-green-700 bg-gradient-to-r from-green-100 to-green-50 border-green-300'
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-gradient-to-r from-green-100 to-green-50 border-green-300'
      case 'in-progress': return 'text-primary-700 bg-gradient-to-r from-primary-100 to-primary-50 border-primary-300'
      case 'pending': return 'text-gold-700 bg-gradient-to-r from-gold-100 to-gold-50 border-gold-300'
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Tasks</h1>
            <p className="text-xl mt-3 text-gray-700 font-medium">Manage all outstanding issues and assignments</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-300 shadow-lg"
          >
            <Plus size={22} />
            New Task
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
          >
            <option value="all">All Assignees</option>
            <option value="Jessica">Jessica</option>
            <option value="Kevin">Kevin</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <p className="text-gray-500 font-medium text-lg">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => handleTaskClick(task)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Status:</span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`px-2 py-1 rounded border text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Assigned to:</span>
                      <span className="font-medium text-gray-900">{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Due:</span>
                      <span className={`font-medium ${isPast(new Date(task.dueDate)) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-900'}`}>
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {task.documents && task.documents.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <span className="text-gray-700">{task.documents.length} document{task.documents.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {task.documents && task.documents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attached Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded border border-gray-200 text-sm">
                            <FileText size={14} className="text-gray-500" />
                            <span className="text-gray-700">{doc.name}</span>
                            <span className="text-gray-400 text-xs">({(doc.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveMenu(activeMenu === task.id ? null : task.id)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  {activeMenu === task.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(task)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 size={16} />
                        Edit Task
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadingTaskId(task.id)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Upload size={16} />
                        Upload Document
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(task.id)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTask(null)
          }}
        />
      )}

      {uploadingTaskId && (
        <DocumentUpload
          taskId={uploadingTaskId}
          onClose={() => setUploadingTaskId(null)}
        />
      )}

      {selectedTask && (
        <TaskDetailView
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}

export default Tasks
