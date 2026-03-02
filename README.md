# Jessica Morris - Personal Assistant System

A modern, SharePoint-style Personal Assistant (PA) system for managing tasks, calendar events, and documents.

## Features

- **Dashboard**: Overview of all tasks, events, and statistics
- **Task Management**: Create, edit, and assign tasks to Jessica or Kevin
- **Calendar**: Visual calendar with event management
- **Document Upload**: Attach documents to tasks with drag-and-drop support
- **SharePoint-Style UI**: Professional interface with top menu bar and side navigation
- **Local Storage**: All data persists in browser localStorage

## Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **date-fns** - Date manipulation library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Usage

### Tasks
- Click "New Task" to create a task
- Assign tasks to Jessica or Kevin
- Set priority (Low, Medium, High) and due dates
- Upload documents to any task
- Update task status (Pending, In Progress, Completed)

### Calendar
- View events in a monthly calendar
- Create events with different types (Meeting, Appointment, Deadline, Reminder)
- Click on any date to see events for that day

### Documents
- View all uploaded documents across all tasks
- Search and filter documents
- Download documents as needed

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- Data persists between sessions
- Data is private to your browser
- Clearing browser data will remove all tasks and events

## Customization

The application uses the Jessica Morris logos located in the project root:
- `jm_remove_back.png` - Logo with transparent background
- `jm.png` - Standard logo
- `jm_web.webp` - Web-optimized logo

## Support

For issues or questions, contact the development team.
