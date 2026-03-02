import React, { useState } from 'react'
import { useNotesContext } from '../context/NotesContext'
import { Plus, Search, Pin, Edit2, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote, pinNote } = useNotesContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general' })

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(note => note.pinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingNote) {
      updateNote(editingNote.id, formData)
    } else {
      addNote(formData)
    }
    setIsModalOpen(false)
    setEditingNote(null)
    setFormData({ title: '', content: '', category: 'general' })
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setFormData({ title: note.title, content: note.content, category: note.category })
    setIsModalOpen(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'important': return 'bg-red-100 text-red-700 border-red-300'
      case 'personal': return 'bg-primary-100 text-primary-700 border-primary-300'
      case 'work': return 'bg-gold-100 text-gold-700 border-gold-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const NoteCard = ({ note }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
            {note.pinned && <Pin size={16} className="text-primary-600 fill-current" />}
          </div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(note.category)}`}>
            {note.category}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => pinNote(note.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Pin size={18} className={note.pinned ? 'text-primary-600 fill-current' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => handleEdit(note)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => deleteNote(note.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
      <p className="text-xs text-gray-500">
        Updated {format(new Date(note.updatedAt), 'MMM dd, yyyy h:mm a')}
      </p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Notes & Memos</h1>
            <p className="text-xl mt-3 text-gray-700 font-medium">Quick notes and important reminders</p>
          </div>
          <button
            onClick={() => {
              setEditingNote(null)
              setFormData({ title: '', content: '', category: 'general' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-300 shadow-lg"
          >
            <Plus size={22} />
            New Note
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pinned Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        </div>
      )}

      <div>
        {pinnedNotes.length > 0 && <h2 className="text-2xl font-bold text-gray-900 mb-4">All Notes</h2>}
        {unpinnedNotes.length === 0 && pinnedNotes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <p className="text-gray-500 font-medium text-lg">No notes yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 bg-primary-300">
              <h2 className="text-3xl font-bold text-gray-800">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingNote(null)
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Note title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Write your note here..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingNote(null)
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg"
                >
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes
