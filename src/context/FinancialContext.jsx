import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const FinancialContext = createContext()

export const useFinancialContext = () => {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancialContext must be used within FinancialProvider')
  }
  return context
}

export const FinancialProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    try {
      const data = await api.getFinancialRecords()
      setExpenses(data.filter(r => r.type === 'expense'))
      setInvoices(data.filter(r => r.type === 'invoice'))
    } catch (error) {
      console.error('Failed to load financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense) => {
    try {
      const newExpense = {
        ...expense,
        type: 'expense',
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      const created = await api.createFinancialRecord(newExpense)
      setExpenses([...expenses, created])
    } catch (error) {
      console.error('Failed to add expense:', error)
    }
  }

  const updateExpense = async (id, updates) => {
    try {
      const expense = expenses.find(e => e.id === id)
      if (!expense) return
      
      const updatedExpense = { ...expense, ...updates }
      await api.updateFinancialRecord(id, updatedExpense)
      setExpenses(expenses.map(e => e.id === id ? updatedExpense : e))
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const deleteExpense = async (id) => {
    try {
      await api.deleteFinancialRecord(id)
      setExpenses(expenses.filter(expense => expense.id !== id))
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  const addInvoice = async (invoice) => {
    try {
      const newInvoice = {
        ...invoice,
        type: 'invoice',
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      const created = await api.createFinancialRecord(newInvoice)
      setInvoices([...invoices, created])
    } catch (error) {
      console.error('Failed to add invoice:', error)
    }
  }

  const updateInvoice = async (id, updates) => {
    try {
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) return
      
      const updatedInvoice = { ...invoice, ...updates }
      await api.updateFinancialRecord(id, updatedInvoice)
      setInvoices(invoices.map(i => i.id === id ? updatedInvoice : i))
    } catch (error) {
      console.error('Failed to update invoice:', error)
    }
  }

  const deleteInvoice = async (id) => {
    try {
      await api.deleteFinancialRecord(id)
      setInvoices(invoices.filter(invoice => invoice.id !== id))
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    }
  }

  if (loading) {
    return (
      <FinancialContext.Provider value={{
        expenses: [],
        addExpense: () => {},
        updateExpense: () => {},
        deleteExpense: () => {},
        invoices: [],
        addInvoice: () => {},
        updateInvoice: () => {},
        deleteInvoice: () => {},
        loading: true
      }}>
        {children}
      </FinancialContext.Provider>
    )
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
      deleteInvoice,
      loading: false
    }}>
      {children}
    </FinancialContext.Provider>
  )
}
