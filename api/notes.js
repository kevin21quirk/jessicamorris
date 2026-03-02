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
      const notes = await sql`SELECT * FROM notes ORDER BY pinned DESC, created_at DESC`;
      return res.status(200).json(notes);
    }

    if (req.method === 'POST') {
      const { id, title, content, category, pinned } = req.body;
      
      const result = await sql`
        INSERT INTO notes (id, title, content, category, pinned)
        VALUES (${id}, ${title}, ${content || ''}, ${category || 'General'}, ${pinned || false})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { title, content, category, pinned } = req.body;
      
      const result = await sql`
        UPDATE notes
        SET title = ${title},
            content = ${content},
            category = ${category},
            pinned = ${pinned},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM notes WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
