import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const ProjectsContext = createContext()

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjectsContext must be used within ProjectsProvider')
  }
  return context
}

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (project) => {
    try {
      const newProject = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        tasks: [],
        milestones: []
      }
      const created = await api.createProject(newProject)
      setProjects([...projects, created])
    } catch (error) {
      console.error('Failed to add project:', error)
    }
  }

  const updateProject = async (id, updates) => {
    try {
      const project = projects.find(p => p.id === id)
      if (!project) return
      
      const updatedProject = { ...project, ...updates }
      await api.updateProject(id, updatedProject)
      setProjects(projects.map(p => p.id === id ? updatedProject : p))
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const deleteProject = async (id) => {
    try {
      await api.deleteProject(id)
      setProjects(projects.filter(project => project.id !== id))
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const addProjectTask = async (projectId, task) => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project) return
      
      const newTask = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      const updatedProject = {
        ...project,
        tasks: [...(project.tasks || []), newTask]
      }
      
      await api.updateProject(projectId, updatedProject)
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p))
    } catch (error) {
      console.error('Failed to add project task:', error)
    }
  }

  const addMilestone = async (projectId, milestone) => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project) return
      
      const newMilestone = {
        ...milestone,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      const updatedProject = {
        ...project,
        milestones: [...(project.milestones || []), newMilestone]
      }
      
      await api.updateProject(projectId, updatedProject)
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p))
    } catch (error) {
      console.error('Failed to add milestone:', error)
    }
  }

  if (loading) {
    return (
      <ProjectsContext.Provider value={{
        projects: [],
        addProject: () => {},
        updateProject: () => {},
        deleteProject: () => {},
        addProjectTask: () => {},
        addMilestone: () => {},
        loading: true
      }}>
        {children}
      </ProjectsContext.Provider>
    )
  }

  return (
    <ProjectsContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      addProjectTask,
      addMilestone,
      loading: false
    }}>
      {children}
    </ProjectsContext.Provider>
  )
}
