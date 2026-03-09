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
      const formattedEmails = emails.map(email => ({
        ...email,
        from: email.from_email,
        to: email.to_email,
        relatedTask: email.related_task,
        relatedTaskTitle: email.related_task_title,
        createdAt: email.created_at
      }));
      return res.status(200).json(formattedEmails);
    }

    if (req.method === 'POST') {
      const { id, from, to, subject, body, direction, status, relatedTask, relatedTaskTitle, date } = req.body;
      
      const result = await sql`
        INSERT INTO emails (id, from_email, to_email, subject, body, direction, status, related_task, related_task_title, date)
        VALUES (${id}, ${from}, ${to}, ${subject}, ${body || ''}, ${direction}, ${status}, ${relatedTask || null}, ${relatedTaskTitle || null}, ${date || new Date().toISOString()})
        RETURNING *
      `;
      
      const formatted = {
        ...result[0],
        from: result[0].from_email,
        to: result[0].to_email,
        relatedTask: result[0].related_task,
        relatedTaskTitle: result[0].related_task_title,
        createdAt: result[0].created_at
      };
      
      return res.status(201).json(formatted);
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
      
      const formatted = {
        ...result[0],
        from: result[0].from_email,
        to: result[0].to_email,
        relatedTask: result[0].related_task,
        relatedTaskTitle: result[0].related_task_title,
        createdAt: result[0].created_at
      };
      
      return res.status(200).json(formatted);
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
