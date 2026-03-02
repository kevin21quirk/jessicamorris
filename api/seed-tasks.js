import { sql } from './db.js';

async function seedTasks() {
  try {
    const defaultTasks = [
      {
        id: '1',
        title: 'Daily Telegraph Lawyer',
        description: '',
        assigned_to: 'Jessica',
        status: 'pending',
        priority: 'high',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: JSON.stringify([{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]),
        documents: JSON.stringify([])
      },
      {
        id: '2',
        title: 'ACAS Contact',
        description: '',
        assigned_to: 'Jessica',
        status: 'pending',
        priority: 'high',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: JSON.stringify([{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]),
        documents: JSON.stringify([])
      },
      {
        id: '3',
        title: 'Vauxhall Lawyer',
        description: '',
        assigned_to: 'Jessica',
        status: 'pending',
        priority: 'high',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: JSON.stringify([{
          id: '1',
          type: 'created',
          message: 'Task created',
          user: 'System',
          timestamp: new Date().toISOString()
        }]),
        documents: JSON.stringify([])
      }
    ];

    for (const task of defaultTasks) {
      // Check if task already exists
      const existing = await sql`SELECT id FROM tasks WHERE id = ${task.id}`;
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO tasks (id, title, description, status, priority, assigned_to, due_date, timeline, documents)
          VALUES (${task.id}, ${task.title}, ${task.description}, ${task.status}, ${task.priority}, ${task.assigned_to}, ${task.due_date}, ${task.timeline}, ${task.documents})
        `;
        console.log(`✅ Added task: ${task.title}`);
      } else {
        console.log(`⏭️  Task already exists: ${task.title}`);
      }
    }

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedTasks();
