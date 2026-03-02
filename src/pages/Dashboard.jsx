import React from 'react'
import { useTaskContext } from '../context/TaskContext'
import { useNotesContext } from '../context/NotesContext'
import { useContactsContext } from '../context/ContactsContext'
import { useEmailContext } from '../context/EmailContext'
import { useFinancialContext } from '../context/FinancialContext'
import { useProjectsContext } from '../context/ProjectsContext'
import { Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  StickyNote,
  Users,
  Mail,
  DollarSign,
  Briefcase,
  TrendingDown
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const Dashboard = () => {
  const { tasks, calendarEvents } = useTaskContext()
  const { notes } = useNotesContext()
  const { contacts } = useContactsContext()
  const { emails } = useEmailContext()
  const { expenses, invoices } = useFinancialContext()
  const { projects } = useProjectsContext()

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && isPast(new Date(t.dueDate))).length
  }

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const upcomingEvents = calendarEvents
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  const StatCard = ({ title, value, icon: Icon, gradient, iconColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${gradient} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={iconColor} size={24} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-gradient-to-r from-red-100 to-red-50 border border-red-200'
      case 'medium': return 'text-gold-700 bg-gradient-to-r from-gold-100 to-gold-50 border border-gold-200'
      case 'low': return 'text-green-700 bg-gradient-to-r from-green-100 to-green-50 border border-green-200'
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200'
    }
  }

  const getDateLabel = (date) => {
    const d = new Date(date)
    if (isToday(d)) return 'Today'
    if (isTomorrow(d)) return 'Tomorrow'
    if (isPast(d)) return 'Overdue'
    return format(d, 'MMM dd, yyyy')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">Welcome back! Here's your overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard
          title="Tasks"
          value={stats.total}
          icon={CheckCircle2}
          gradient="bg-primary-400"
          iconColor="text-white"
        />
        <StatCard
          title="Events"
          value={calendarEvents.length}
          icon={CalendarIcon}
          gradient="bg-gold-400"
          iconColor="text-white"
        />
        <StatCard
          title="Notes"
          value={notes.length}
          icon={StickyNote}
          gradient="bg-purple-400"
          iconColor="text-white"
        />
        <StatCard
          title="Contacts"
          value={contacts.length}
          icon={Users}
          gradient="bg-green-400"
          iconColor="text-white"
        />
        <StatCard
          title="Projects"
          value={projects.length}
          icon={Briefcase}
          gradient="bg-blue-400"
          iconColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Emails</p>
              <p className="text-3xl font-bold text-gold-600 mt-2">{emails.filter(e => e.status === 'pending').length}</p>
            </div>
            <div className="p-3 bg-gold-100 rounded-xl">
              <Mail size={28} className="text-gold-600" />
            </div>
          </div>
          <Link to="/emails" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View All →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-2">£{expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown size={28} className="text-red-600" />
            </div>
          </div>
          <Link to="/financial" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View Financial →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Invoices</p>
              <p className="text-3xl font-bold text-green-600 mt-2">£{invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign size={28} className="text-green-600" />
            </div>
          </div>
          <Link to="/financial" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View Financial →</Link>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-red-600 rounded-xl">
            <AlertCircle className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-red-900 text-lg">
              {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-700 font-medium">Please review and update these tasks</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Notes</h2>
              <Link to="/notes" className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs text-white font-semibold transition-all">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No notes yet</p>
            ) : (
              notes.slice(0, 3).map(note => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                  <h3 className="font-semibold text-gray-900">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Active Projects</h2>
              <Link to="/projects" className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs text-white font-semibold transition-all">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {projects.filter(p => p.status === 'in-progress').length === 0 ? (
              <p className="text-center text-gray-500 py-4">No active projects</p>
            ) : (
              projects.filter(p => p.status === 'in-progress').slice(0, 3).map(project => (
                <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description || 'No description'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upcoming Tasks</h2>
              <Link to="/tasks" className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs text-white font-semibold transition-all">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No upcoming tasks
              </div>
            ) : (
              upcomingTasks.map(task => (
                <div key={task.id} className="p-5 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-gold-50/50 transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-base">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                          {task.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isPast(new Date(task.dueDate)) && task.status !== 'completed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {getDateLabel(task.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              <Link to="/calendar" className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs text-white font-semibold transition-all">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No upcoming events
              </div>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="p-5 hover:bg-gradient-to-r hover:from-gold-50/50 hover:to-primary-50/50 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold-400 rounded-xl shadow-md">
                      <CalendarIcon className="text-white" size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-700 mt-2 font-medium bg-gray-100 inline-block px-3 py-1.5 rounded-lg">
                        {format(new Date(event.date), 'MMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
