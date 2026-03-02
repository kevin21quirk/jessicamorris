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
      const records = await sql`SELECT * FROM financial_records ORDER BY date DESC`;
      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      const { id, type, amount, category, description, date, status, client, invoiceNumber, dueDate } = req.body;
      
      const result = await sql`
        INSERT INTO financial_records (id, type, amount, category, description, date, status, client, invoice_number, due_date)
        VALUES (${id}, ${type}, ${amount}, ${category || ''}, ${description || ''}, ${date}, ${status || 'pending'}, ${client || ''}, ${invoiceNumber || ''}, ${dueDate || null})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { type, amount, category, description, date, status, client, invoiceNumber, dueDate } = req.body;
      
      const result = await sql`
        UPDATE financial_records
        SET type = ${type},
            amount = ${amount},
            category = ${category},
            description = ${description},
            date = ${date},
            status = ${status},
            client = ${client},
            invoice_number = ${invoiceNumber},
            due_date = ${dueDate}
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM financial_records WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
