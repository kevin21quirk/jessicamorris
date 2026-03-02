import React, { createContext, useContext, useState, useEffect } from 'react'

const NotesContext = createContext()

export const useNotesContext = () => {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotesContext must be used within NotesProvider')
  }
  return context
}

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('jm-notes')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-notes', JSON.stringify(notes))
  }, [notes])

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ))
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const pinNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ))
  }

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      pinNote
    }}>
      {children}
    </NotesContext.Provider>
  )
}
