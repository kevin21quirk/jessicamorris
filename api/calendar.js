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
      const events = await sql`SELECT * FROM calendar_events ORDER BY date ASC`;
      return res.status(200).json(events);
    }

    if (req.method === 'POST') {
      const { id, title, date, time, description, type } = req.body;
      
      const result = await sql`
        INSERT INTO calendar_events (id, title, date, time, description, type)
        VALUES (${id}, ${title}, ${date}, ${time || ''}, ${description || ''}, ${type || 'event'})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { title, date, time, description, type } = req.body;
      
      const result = await sql`
        UPDATE calendar_events
        SET title = ${title},
            date = ${date},
            time = ${time},
            description = ${description},
            type = ${type}
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM calendar_events WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
