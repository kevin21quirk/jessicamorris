import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const EmailContext = createContext()

export const useEmailContext = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailContext must be used within EmailProvider')
  }
  return context
}

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    try {
      const data = await api.getEmails()
      setEmails(data)
    } catch (error) {
      console.error('Failed to load emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEmail = async (email) => {
    try {
      const newEmail = {
        ...email,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      const created = await api.createEmail(newEmail)
      setEmails([...emails, created])
    } catch (error) {
      console.error('Failed to add email:', error)
    }
  }

  const updateEmail = async (id, updates) => {
    try {
      const email = emails.find(e => e.id === id)
      if (!email) return
      
      const updatedEmail = { ...email, ...updates }
      await api.updateEmail(id, updatedEmail)
      setEmails(emails.map(e => e.id === id ? updatedEmail : e))
    } catch (error) {
      console.error('Failed to update email:', error)
    }
  }

  const deleteEmail = async (id) => {
    try {
      await api.deleteEmail(id)
      setEmails(emails.filter(email => email.id !== id))
    } catch (error) {
      console.error('Failed to delete email:', error)
    }
  }

  if (loading) {
    return (
      <EmailContext.Provider value={{
        emails: [],
        addEmail: () => {},
        updateEmail: () => {},
        deleteEmail: () => {},
        loading: true
      }}>
        {children}
      </EmailContext.Provider>
    )
  }

  return (
    <EmailContext.Provider value={{
      emails,
      addEmail,
      updateEmail,
      deleteEmail,
      loading: false
    }}>
      {children}
    </EmailContext.Provider>
  )
}
