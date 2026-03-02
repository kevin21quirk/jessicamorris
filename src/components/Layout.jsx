import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Menu, 
  X,
  User,
  StickyNote,
  Users,
  Mail,
  DollarSign,
  Briefcase,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Notes', href: '/notes', icon: StickyNote },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Email Log', href: '/emails', icon: Mail },
    { name: 'Financial', href: '/financial', icon: DollarSign },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Documents', href: '/documents', icon: FileText },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside 
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-600 to-primary-800 shadow-2xl transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-72' : isMobile ? '-translate-x-full w-72' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">JM</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm">Jessica Morris</h2>
                    <p className="text-white/70 text-xs">PA System</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white ml-auto"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    active
                      ? 'bg-white text-primary-700 shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                  {active && sidebarOpen && (
                    <div className="absolute right-3 w-2 h-2 bg-gold-400 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <div className={`flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl ${
              sidebarOpen ? '' : 'justify-center'
            }`}>
              <User size={20} className="text-white flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium text-white">{user?.name || 'Admin'}</span>}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all text-white ${
                sidebarOpen ? '' : 'justify-center'
              }`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarOpen ? 'ml-72' : 'ml-20')
      }`}>
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-2 md:gap-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 md:hidden"
                >
                  <Menu size={24} />
                </button>
              )}
              <img 
                src="/jm_remove_back.png" 
                alt="Jessica Morris" 
                className="h-12 w-12 md:h-48 md:w-48 object-contain drop-shadow-lg md:-my-12"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">Jessica Morris</h1>
                <p className="text-xs text-gray-500 font-medium hidden md:block">Personal Assistant System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-gold-50 rounded-full border border-primary-200/50">
                <span className="text-sm font-semibold bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
