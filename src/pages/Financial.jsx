import React, { useState } from 'react'
import { useFinancialContext } from '../context/FinancialContext'
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'

const Financial = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, invoices, addInvoice, updateInvoice, deleteInvoice } = useFinancialContext()
  const [activeTab, setActiveTab] = useState('expenses')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'general',
    status: 'pending'
  })

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredInvoices = invoices.filter(inv =>
    inv.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
  const totalInvoices = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeTab === 'expenses') {
      if (editingItem) {
        updateExpense(editingItem.id, formData)
      } else {
        addExpense(formData)
      }
    } else {
      if (editingItem) {
        updateInvoice(editingItem.id, formData)
      } else {
        addInvoice(formData)
      }
    }
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'general', status: 'pending' })
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      description: item.description,
      amount: item.amount,
      date: item.date,
      category: item.category,
      status: item.status
    })
    setIsModalOpen(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'legal': return 'bg-red-100 text-red-700 border-red-300'
      case 'professional': return 'bg-primary-100 text-primary-700 border-primary-300'
      case 'personal': return 'bg-gold-100 text-gold-700 border-gold-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-300'
      case 'pending': return 'bg-gold-100 text-gold-700 border-gold-300'
      case 'overdue': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Financial</h1>
            <p className="text-xl mt-3 text-gray-700 font-medium">Track expenses and invoices</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null)
              setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'general', status: 'pending' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-300 shadow-lg"
          >
            <Plus size={22} />
            Add {activeTab === 'expenses' ? 'Expense' : 'Invoice'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-2">£{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown size={28} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-green-600 mt-2">£{totalInvoices.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Invoices</p>
              <p className="text-3xl font-bold text-gold-600 mt-2">£{pendingInvoices.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-gold-100 rounded-xl">
              <DollarSign size={28} className="text-gold-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'expenses'
                ? 'bg-primary-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'invoices'
                ? 'bg-primary-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Invoices
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {activeTab === 'expenses' ? (
        filteredExpenses.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <p className="text-gray-500 font-medium text-lg">No expenses recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{expense.description}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="font-medium text-red-600 text-xl">£{parseFloat(expense.amount).toFixed(2)}</span>
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredInvoices.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <p className="text-gray-500 font-medium text-lg">No invoices recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map(invoice => (
              <div key={invoice.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{invoice.description}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(invoice.category)}`}>
                        {invoice.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="font-medium text-green-600 text-xl">£{parseFloat(invoice.amount).toFixed(2)}</span>
                      <span>{format(new Date(invoice.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 bg-primary-300">
              <h2 className="text-3xl font-bold text-gray-800">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'expenses' ? 'Expense' : 'Invoice'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingItem(null)
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <option value="legal">Legal</option>
                    <option value="professional">Professional</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingItem(null)
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg"
                >
                  {editingItem ? 'Update' : 'Add'} {activeTab === 'expenses' ? 'Expense' : 'Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Financial
