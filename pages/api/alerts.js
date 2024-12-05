// pages/api/alerts.js
import clientPromise from '@/database/mongodb';
  
export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.connection.db;

    if (req.method === 'GET') {
      const alerts = await db.collection('alerthistories').find({}).toArray();
      res.status(200).json(alerts);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
}
