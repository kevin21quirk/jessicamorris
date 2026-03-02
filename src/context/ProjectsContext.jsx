import React, { createContext, useContext, useState, useEffect } from 'react'

const ProjectsContext = createContext()

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjectsContext must be used within ProjectsProvider')
  }
  return context
}

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('jm-projects')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('jm-projects', JSON.stringify(projects))
  }, [projects])

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tasks: [],
      milestones: []
    }
    setProjects([...projects, newProject])
  }

  const updateProject = (id, updates) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ))
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  const addProjectTask = (projectId, task) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newTask = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
        return {
          ...project,
          tasks: [...(project.tasks || []), newTask]
        }
      }
      return project
    }))
  }

  const addMilestone = (projectId, milestone) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newMilestone = {
          ...milestone,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
        return {
          ...project,
          milestones: [...(project.milestones || []), newMilestone]
        }
      }
      return project
    }))
  }

  return (
    <ProjectsContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      addProjectTask,
      addMilestone
    }}>
      {children}
    </ProjectsContext.Provider>
  )
}
