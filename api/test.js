export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return res.status(200).json({ 
    message: 'API is working!',
    env: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set',
    timestamp: new Date().toISOString()
  });
}
