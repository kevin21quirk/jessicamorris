const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const api = {
  // Tasks
  async getTasks() {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(task) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id, task) {
    const res = await fetch(`${API_BASE}/tasks?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // Emails
  async getEmails() {
    const res = await fetch(`${API_BASE}/emails`);
    if (!res.ok) throw new Error('Failed to fetch emails');
    return res.json();
  },

  async createEmail(email) {
    const res = await fetch(`${API_BASE}/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email)
    });
    if (!res.ok) throw new Error('Failed to create email');
    return res.json();
  },

  async updateEmail(id, email) {
    const res = await fetch(`${API_BASE}/emails?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email)
    });
    if (!res.ok) throw new Error('Failed to update email');
    return res.json();
  },

  async deleteEmail(id) {
    const res = await fetch(`${API_BASE}/emails?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete email');
    return res.json();
  },

  // Notes
  async getNotes() {
    const res = await fetch(`${API_BASE}/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async createNote(note) {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async updateNote(id, note) {
    const res = await fetch(`${API_BASE}/notes?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id) {
    const res = await fetch(`${API_BASE}/notes?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete note');
    return res.json();
  },

  // Contacts
  async getContacts() {
    const res = await fetch(`${API_BASE}/contacts`);
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
  },

  async createContact(contact) {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    if (!res.ok) throw new Error('Failed to create contact');
    return res.json();
  },

  async updateContact(id, contact) {
    const res = await fetch(`${API_BASE}/contacts?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    if (!res.ok) throw new Error('Failed to update contact');
    return res.json();
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/contacts?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
  },

  // Financial
  async getFinancialRecords() {
    const res = await fetch(`${API_BASE}/financial`);
    if (!res.ok) throw new Error('Failed to fetch financial records');
    return res.json();
  },

  async createFinancialRecord(record) {
    const res = await fetch(`${API_BASE}/financial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to create financial record');
    return res.json();
  },

  async updateFinancialRecord(id, record) {
    const res = await fetch(`${API_BASE}/financial?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to update financial record');
    return res.json();
  },

  async deleteFinancialRecord(id) {
    const res = await fetch(`${API_BASE}/financial?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete financial record');
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(project) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id, project) {
    const res = await fetch(`${API_BASE}/projects?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Calendar
  async getCalendarEvents() {
    const res = await fetch(`${API_BASE}/calendar`);
    if (!res.ok) throw new Error('Failed to fetch calendar events');
    return res.json();
  },

  async createCalendarEvent(event) {
    const res = await fetch(`${API_BASE}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to create calendar event');
    return res.json();
  },

  async updateCalendarEvent(id, event) {
    const res = await fetch(`${API_BASE}/calendar?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to update calendar event');
    return res.json();
  },

  async deleteCalendarEvent(id) {
    const res = await fetch(`${API_BASE}/calendar?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete calendar event');
    return res.json();
  }
};
