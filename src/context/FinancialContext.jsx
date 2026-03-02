import React, { createContext, useContext, useState, useEffect } from 'react'

const FinancialContext = createContext()

export const useFinancialContext = () => {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancialContext must be used within FinancialProvider')
  }
  return context
}

export const FinancialProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('jm-expenses')
    return saved ? JSON.parse(saved) : []
  })

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('jm-invoices')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('jm-invoices', JSON.stringify(invoices))
  }, [invoices])

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setExpenses([...expenses, newExpense])
  }

  const updateExpense = (id, updates) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ))
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const addInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setInvoices([...invoices, newInvoice])
  }

  const updateInvoice = (id, updates) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ))
  }

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id))
  }

  return (
    <FinancialContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice
    }}>
      {children}
    </FinancialContext.Provider>
  )
}
