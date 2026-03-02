import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const ContactsContext = createContext()

export const useContactsContext = () => {
  const context = useContext(ContactsContext)
  if (!context) {
    throw new Error('useContactsContext must be used within ContactsProvider')
  }
  return context
}

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const data = await api.getContacts()
      setContacts(data)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContact = async (contact) => {
    try {
      const newContact = {
        ...contact,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      const created = await api.createContact(newContact)
      setContacts([...contacts, created])
    } catch (error) {
      console.error('Failed to add contact:', error)
    }
  }

  const updateContact = async (id, updates) => {
    try {
      const contact = contacts.find(c => c.id === id)
      if (!contact) return
      
      const updatedContact = { ...contact, ...updates }
      await api.updateContact(id, updatedContact)
      setContacts(contacts.map(c => c.id === id ? updatedContact : c))
    } catch (error) {
      console.error('Failed to update contact:', error)
    }
  }

  const deleteContact = async (id) => {
    try {
      await api.deleteContact(id)
      setContacts(contacts.filter(contact => contact.id !== id))
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  if (loading) {
    return (
      <ContactsContext.Provider value={{
        contacts: [],
        addContact: () => {},
        updateContact: () => {},
        deleteContact: () => {},
        loading: true
      }}>
        {children}
      </ContactsContext.Provider>
    )
  }

  return (
    <ContactsContext.Provider value={{
      contacts,
      addContact,
      updateContact,
      deleteContact,
      loading: false
    }}>
      {children}
    </ContactsContext.Provider>
  )
}
