import React, { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext()

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('jm-tasks')
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Daily Telegraph Lawyer',
        description: '',
        assignedTo: 'Jessica',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        documents: [],
        timeline: [{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]
      },
      {
        id: '2',
        title: 'ACAS Contact',
        description: '',
        assignedTo: 'Jessica',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        documents: [],
        timeline: [{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]
      },
      {
        id: '3',
        title: 'Vauxhall Lawyer',
        description: '',
        assignedTo: 'Jessica',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        documents: [],
        timeline: [{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]
      }
    ]
  })

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('jm-calendar')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('jm-calendar', JSON.stringify(calendarEvents))
  }, [calendarEvents])

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      documents: [],
      timeline: [{
        id: '1',
        type: 'created',
        message: 'Task created',
        user: 'Admin',
        timestamp: new Date().toISOString()
      }]
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id, updates, timelineMessage) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates }
        if (timelineMessage) {
          const timelineEntry = {
            id: Date.now().toString(),
            type: 'update',
            message: timelineMessage,
            user: 'Admin',
            timestamp: new Date().toISOString()
          }
          updatedTask.timeline = [...(task.timeline || []), timelineEntry]
        }
        return updatedTask
      }
      return task
    }))
  }

  const addTimelineEntry = (taskId, entry) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const timelineEntry = {
          id: Date.now().toString(),
          type: entry.type || 'update',
          message: entry.message,
          user: entry.user || 'Admin',
          timestamp: new Date().toISOString()
        }
        return {
          ...task,
          timeline: [...(task.timeline || []), timelineEntry]
        }
      }
      return task
    }))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const addDocument = (taskId, document) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const timelineEntry = {
          id: Date.now().toString(),
          type: 'document',
          message: `Document uploaded: ${document.name}`,
          user: 'Admin',
          timestamp: new Date().toISOString()
        }
        return {
          ...task,
          documents: [...(task.documents || []), document],
          timeline: [...(task.timeline || []), timelineEntry]
        }
      }
      return task
    }))
  }

  const addCalendarEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    }
    setCalendarEvents([...calendarEvents, newEvent])
  }

  const updateCalendarEvent = (id, updates) => {
    setCalendarEvents(calendarEvents.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ))
  }

  const deleteCalendarEvent = (id) => {
    setCalendarEvents(calendarEvents.filter(event => event.id !== id))
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      addDocument,
      addTimelineEntry,
      calendarEvents,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent
    }}>
      {children}
    </TaskContext.Provider>
  )
}
