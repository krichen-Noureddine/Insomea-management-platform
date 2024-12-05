import clientPromise from '@/database/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.connection.db;

  switch (req.method) {
    case 'DELETE':
      try {
        const { id } = req.query; // Get the email ID from the query parameter

        if (!id) {
          return res.status(400).json({ error: 'Email ID is required' });
        }

        // Delete the email with the specified ID
        const result = await db.collection('Email').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Email not found' });
        }

        res.status(200).json({ message: 'Email deleted successfully' });
      } catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ error: 'Failed to delete email' });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
