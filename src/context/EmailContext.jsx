import React, { createContext, useContext, useState, useEffect } from 'react'

const EmailContext = createContext()

export const useEmailContext = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailContext must be used within EmailProvider')
  }
  return context
}

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('jm-emails')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-emails', JSON.stringify(emails))
  }, [emails])

  const addEmail = (email) => {
    const newEmail = {
      ...email,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setEmails([...emails, newEmail])
  }

  const updateEmail = (id, updates) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, ...updates } : email
    ))
  }

  const deleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id))
  }

  return (
    <EmailContext.Provider value={{
      emails,
      addEmail,
      updateEmail,
      deleteEmail
    }}>
      {children}
    </EmailContext.Provider>
  )
}
