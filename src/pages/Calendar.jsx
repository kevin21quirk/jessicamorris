import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns'
import CalendarModal from '../components/CalendarModal'

const Calendar = () => {
  const { calendarEvents, deleteCalendarEvent } = useTaskContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    )
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  const handleEdit = (event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
    setActiveMenu(null)
  }

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteCalendarEvent(eventId)
    }
    setActiveMenu(null)
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-primary-500'
      case 'appointment': return 'bg-green-500'
      case 'deadline': return 'bg-red-500'
      case 'reminder': return 'bg-gold-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-300 rounded-3xl shadow-xl p-8 text-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Calendar</h1>
            <p className="text-xl mt-3 text-gray-700 font-medium">Manage events and appointments</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-300 shadow-lg"
          >
            <Plus size={22} />
            New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[80px] p-2 rounded-lg border transition-all
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
                    ${isTodayDate ? 'bg-primary-50' : ''}
                    hover:border-primary-300
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${!isCurrentMonth ? 'text-gray-400' : isTodayDate ? 'text-primary-700' : 'text-gray-900'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="bg-primary-300 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-gray-800" size={24} strokeWidth={2.5} />
              <h3 className="text-xl font-bold text-gray-800">
                {format(selectedDate, 'MMM dd, yyyy')}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No events scheduled
              </p>
            ) : (
              selectedDateEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`} />
                        <h4 className="font-medium text-gray-900 text-sm truncate">{event.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {format(new Date(event.date), 'h:mm a')}
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === event.id ? null : event.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                      {activeMenu === event.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleEdit(event)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CalendarModal
          event={editingEvent}
          selectedDate={selectedDate}
          onClose={() => {
            setIsModalOpen(false)
            setEditingEvent(null)
          }}
        />
      )}
    </div>
  )
}

export default Calendar
