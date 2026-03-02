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
      const contacts = await sql`SELECT * FROM contacts ORDER BY name ASC`;
      const formattedContacts = contacts.map(contact => ({
        ...contact,
        createdAt: contact.created_at
      }));
      return res.status(200).json(formattedContacts);
    }

    if (req.method === 'POST') {
      const { id, name, email, phone, company, position, notes } = req.body;
      
      const result = await sql`
        INSERT INTO contacts (id, name, email, phone, company, position, notes)
        VALUES (${id}, ${name}, ${email || ''}, ${phone || ''}, ${company || ''}, ${position || ''}, ${notes || ''})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, email, phone, company, position, notes } = req.body;
      
      const result = await sql`
        UPDATE contacts
        SET name = ${name},
            email = ${email},
            phone = ${phone},
            company = ${company},
            position = ${position},
            notes = ${notes}
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM contacts WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
