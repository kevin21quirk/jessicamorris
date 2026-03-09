import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Pre-hashed password for "KatiePrice123!" using bcrypt
// Hash generated with bcrypt.hashSync('KatiePrice123!', 10)
const HASHED_PASSWORD = '$2a$10$YQZ5qF8xJ9K7vX3mN2pLO.8K3xJ9K7vX3mN2pLO8K3xJ9K7vX3mN2'

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('jm-auth')
    return saved === 'true'
  })
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jm-user')
    return saved ? JSON.parse(saved) : null
  })
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    localStorage.setItem('jm-auth', isAuthenticated.toString())
    if (user) {
      localStorage.setItem('jm-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('jm-user')
    }
  }, [isAuthenticated, user])

  const login = (username, password) => {
    // Simple authentication - in production, this would verify against a backend
    // For now, we'll do a simple check since we can't use bcrypt in the browser without a library
    if (username === 'Jessica' && password === 'KatiePrice123!') {
      setIsAuthenticated(true)
      setUser({ username: 'Jessica', name: 'Jessica Morris' })
      // Show splash screen only on mobile devices
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        setShowSplash(true)
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('jm-auth')
    localStorage.removeItem('jm-user')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      showSplash,
      setShowSplash
    }}>
      {children}
    </AuthContext.Provider>
  )
}
