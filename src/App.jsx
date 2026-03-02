import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Documents from './pages/Documents'
import Notes from './pages/Notes'
import Contacts from './pages/Contacts'
import Emails from './pages/Emails'
import Financial from './pages/Financial'
import Projects from './pages/Projects'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { NotesProvider } from './context/NotesContext'
import { ContactsProvider } from './context/ContactsContext'
import { EmailProvider } from './context/EmailContext'
import { FinancialProvider } from './context/FinancialContext'
import { ProjectsProvider } from './context/ProjectsContext'

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotesProvider>
          <ContactsProvider>
            <EmailProvider>
              <FinancialProvider>
                <ProjectsProvider>
                  <Router>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/*" element={
                        <ProtectedRoute>
                          <Layout>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/tasks" element={<Tasks />} />
                              <Route path="/calendar" element={<Calendar />} />
                              <Route path="/documents" element={<Documents />} />
                              <Route path="/notes" element={<Notes />} />
                              <Route path="/contacts" element={<Contacts />} />
                              <Route path="/emails" element={<Emails />} />
                              <Route path="/financial" element={<Financial />} />
                              <Route path="/projects" element={<Projects />} />
                            </Routes>
                          </Layout>
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Router>
                </ProjectsProvider>
              </FinancialProvider>
            </EmailProvider>
          </ContactsProvider>
        </NotesProvider>
      </TaskProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
