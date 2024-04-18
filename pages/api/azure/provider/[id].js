import { ObjectId } from 'mongodb';
import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  console.log(`Received ${method} request for ID ${id}`);

  const client = await clientPromise;
  const db = client.db();

  switch (method) {
    case 'GET':
      // Implement logic to fetch provider information by ID
      break;

    case 'PUT':
      try {
        console.log(`Updating provider with ID ${id}:`, req.body);
        const updatedProvider = await db.collection('provider').findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: req.body },
          { returnOriginal: false }
        );
        console.log('Provider updated:', updatedProvider.value);
        res.status(200).json(updatedProvider.value);
      } catch (error) {
        console.error('Failed to update provider:', error);
        res.status(400).json({ error: 'Failed to update provider' });
      }
      break;

    case 'DELETE':
      try {
        console.log(`Deleting provider with ID ${id}`);
        await db.collection('provider').deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Provider deleted successfully' });
      } catch (error) {
        console.error('Failed to delete provider:', error);
        res.status(400).json({ error: 'Failed to delete provider' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
