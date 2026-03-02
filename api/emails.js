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
      const emails = await sql`SELECT * FROM emails ORDER BY created_at DESC`;
      return res.status(200).json(emails);
    }

    if (req.method === 'POST') {
      const { id, from, to, subject, body, direction, status, relatedTask, relatedTaskTitle, date } = req.body;
      
      const result = await sql`
        INSERT INTO emails (id, from_email, to_email, subject, body, direction, status, related_task, related_task_title, date)
        VALUES (${id}, ${from}, ${to}, ${subject}, ${body || ''}, ${direction}, ${status}, ${relatedTask || null}, ${relatedTaskTitle || null}, ${date})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { from, to, subject, body, direction, status, relatedTask, relatedTaskTitle } = req.body;
      
      const result = await sql`
        UPDATE emails
        SET from_email = ${from},
            to_email = ${to},
            subject = ${subject},
            body = ${body},
            direction = ${direction},
            status = ${status},
            related_task = ${relatedTask},
            related_task_title = ${relatedTaskTitle}
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM emails WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
