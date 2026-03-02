import React, { createContext, useContext, useState, useEffect } from 'react'

const ContactsContext = createContext()

export const useContactsContext = () => {
  const context = useContext(ContactsContext)
  if (!context) {
    throw new Error('useContactsContext must be used within ContactsProvider')
  }
  return context
}

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('jm-contacts')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-contacts', JSON.stringify(contacts))
  }, [contacts])

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setContacts([...contacts, newContact])
  }

  const updateContact = (id, updates) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ))
  }

  const deleteContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  return (
    <ContactsContext.Provider value={{
      contacts,
      addContact,
      updateContact,
      deleteContact
    }}>
      {children}
    </ContactsContext.Provider>
  )
}
