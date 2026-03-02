import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const NotesContext = createContext()

export const useNotesContext = () => {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotesContext must be used within NotesProvider')
  }
  return context
}

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const data = await api.getNotes()
      setNotes(data)
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async (note) => {
    try {
      const newNote = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const created = await api.createNote(newNote)
      setNotes([...notes, created])
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  const updateNote = async (id, updates) => {
    try {
      const note = notes.find(n => n.id === id)
      if (!note) return
      
      const updatedNote = { ...note, ...updates, updatedAt: new Date().toISOString() }
      await api.updateNote(id, updatedNote)
      setNotes(notes.map(n => n.id === id ? updatedNote : n))
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.deleteNote(id)
      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const pinNote = async (id) => {
    try {
      const note = notes.find(n => n.id === id)
      if (!note) return
      
      const updatedNote = { ...note, pinned: !note.pinned }
      await api.updateNote(id, updatedNote)
      setNotes(notes.map(n => n.id === id ? updatedNote : n))
    } catch (error) {
      console.error('Failed to pin note:', error)
    }
  }

  if (loading) {
    return (
      <NotesContext.Provider value={{
        notes: [],
        addNote: () => {},
        updateNote: () => {},
        deleteNote: () => {},
        pinNote: () => {},
        loading: true
      }}>
        {children}
      </NotesContext.Provider>
    )
  }

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      pinNote,
      loading: false
    }}>
      {children}
    </NotesContext.Provider>
  )
}
