import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const TaskContext = createContext()

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tasksData, eventsData] = await Promise.all([
        api.getTasks(),
        api.getCalendarEvents()
      ])
      setTasks(tasksData)
      setCalendarEvents(eventsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task) => {
    try {
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
      const created = await api.createTask(newTask)
      setTasks([...tasks, created])
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const updateTask = async (id, updates, timelineMessage) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      
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
      
      await api.updateTask(id, updatedTask)
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const addTimelineEntry = async (taskId, entry) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return
      
      const timelineEntry = {
        id: Date.now().toString(),
        type: entry.type || 'update',
        message: entry.message,
        user: entry.user || 'Admin',
        timestamp: new Date().toISOString()
      }
      
      const updatedTask = {
        ...task,
        timeline: [...(task.timeline || []), timelineEntry]
      }
      
      await api.updateTask(taskId, updatedTask)
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (error) {
      console.error('Failed to add timeline entry:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const addDocument = async (taskId, document) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return
      
      const timelineEntry = {
        id: Date.now().toString(),
        type: 'document',
        message: `Document uploaded: ${document.name}`,
        user: 'Admin',
        timestamp: new Date().toISOString()
      }
      
      const updatedTask = {
        ...task,
        documents: [...(task.documents || []), document],
        timeline: [...(task.timeline || []), timelineEntry]
      }
      
      await api.updateTask(taskId, updatedTask)
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (error) {
      console.error('Failed to add document:', error)
    }
  }

  const addCalendarEvent = async (event) => {
    try {
      const newEvent = {
        ...event,
        id: Date.now().toString()
      }
      const created = await api.createCalendarEvent(newEvent)
      setCalendarEvents([...calendarEvents, created])
    } catch (error) {
      console.error('Failed to add calendar event:', error)
    }
  }

  const updateCalendarEvent = async (id, updates) => {
    try {
      const event = calendarEvents.find(e => e.id === id)
      if (!event) return
      
      const updatedEvent = { ...event, ...updates }
      await api.updateCalendarEvent(id, updatedEvent)
      setCalendarEvents(calendarEvents.map(e => e.id === id ? updatedEvent : e))
    } catch (error) {
      console.error('Failed to update calendar event:', error)
    }
  }

  const deleteCalendarEvent = async (id) => {
    try {
      await api.deleteCalendarEvent(id)
      setCalendarEvents(calendarEvents.filter(event => event.id !== id))
    } catch (error) {
      console.error('Failed to delete calendar event:', error)
    }
  }

  if (loading) {
    return (
      <TaskContext.Provider value={{
        tasks: [],
        addTask: () => {},
        updateTask: () => {},
        deleteTask: () => {},
        addDocument: () => {},
        addTimelineEntry: () => {},
        calendarEvents: [],
        addCalendarEvent: () => {},
        updateCalendarEvent: () => {},
        deleteCalendarEvent: () => {},
        loading: true
      }}>
        {children}
      </TaskContext.Provider>
    )
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
      deleteCalendarEvent,
      loading: false
    }}>
      {children}
    </TaskContext.Provider>
  )
}
