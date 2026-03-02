import { sql } from './db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
      // Convert database format to frontend format
      const formattedTasks = tasks.map(task => ({
        ...task,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        timeline: typeof task.timeline === 'string' ? JSON.parse(task.timeline) : task.timeline,
        documents: typeof task.documents === 'string' ? JSON.parse(task.documents) : task.documents
      }));
      return res.status(200).json(formattedTasks);
    }

    if (req.method === 'POST') {
      const { id, title, description, status, priority, assignedTo, dueDate, timeline, documents } = req.body;
      
      const result = await sql`
        INSERT INTO tasks (id, title, description, status, priority, assigned_to, due_date, timeline, documents)
        VALUES (${id}, ${title}, ${description || ''}, ${status}, ${priority}, ${assignedTo}, ${dueDate}, ${JSON.stringify(timeline || [])}, ${JSON.stringify(documents || [])})
        RETURNING *
      `;
      
      const formatted = {
        ...result[0],
        assignedTo: result[0].assigned_to,
        dueDate: result[0].due_date,
        createdAt: result[0].created_at,
        updatedAt: result[0].updated_at,
        timeline: typeof result[0].timeline === 'string' ? JSON.parse(result[0].timeline) : result[0].timeline,
        documents: typeof result[0].documents === 'string' ? JSON.parse(result[0].documents) : result[0].documents
      };
      
      return res.status(201).json(formatted);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { title, description, status, priority, assignedTo, dueDate, timeline, documents } = req.body;
      
      const result = await sql`
        UPDATE tasks
        SET title = ${title},
            description = ${description},
            status = ${status},
            priority = ${priority},
            assigned_to = ${assignedTo},
            due_date = ${dueDate},
            timeline = ${JSON.stringify(timeline)},
            documents = ${JSON.stringify(documents)},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      
      const formatted = {
        ...result[0],
        assignedTo: result[0].assigned_to,
        dueDate: result[0].due_date,
        createdAt: result[0].created_at,
        updatedAt: result[0].updated_at,
        timeline: typeof result[0].timeline === 'string' ? JSON.parse(result[0].timeline) : result[0].timeline,
        documents: typeof result[0].documents === 'string' ? JSON.parse(result[0].documents) : result[0].documents
      };
      
      return res.status(200).json(formatted);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await sql`DELETE FROM tasks WHERE id = ${id}`;
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
