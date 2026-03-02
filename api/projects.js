import { sql } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      const formattedProjects = projects.map(project => ({
        ...project,
        startDate: project.start_date,
        endDate: project.end_date,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        tasks: typeof project.tasks === 'string' ? JSON.parse(project.tasks) : project.tasks,
        milestones: typeof project.milestones === 'string' ? JSON.parse(project.milestones) : project.milestones
      }));
      return res.status(200).json(formattedProjects);
    }

    if (req.method === 'POST') {
      const { id, name, description, status, startDate, endDate, budget, tasks, milestones } = req.body;
      
      const result = await sql`
        INSERT INTO projects (id, name, description, status, start_date, end_date, budget, tasks, milestones)
        VALUES (${id}, ${name}, ${description || ''}, ${status || 'planning'}, ${startDate || null}, ${endDate || null}, ${budget || 0}, ${JSON.stringify(tasks || [])}, ${JSON.stringify(milestones || [])})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, description, status, startDate, endDate, budget, tasks, milestones } = req.body;
      
      const result = await sql`
        UPDATE projects
        SET name = ${name},
            description = ${description},
            status = ${status},
            start_date = ${startDate},
            end_date = ${endDate},
            budget = ${budget},
            tasks = ${JSON.stringify(tasks)},
            milestones = ${JSON.stringify(milestones)},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
