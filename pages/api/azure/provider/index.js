import { ObjectId } from 'mongodb';
import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  console.log(`Received ${method} request`);

  const client = await clientPromise;
  const db = client.db();

  switch (method) {
    case 'GET':
      try {
        const providers = await db.collection('provider').find({}).toArray();
        console.log('Providers retrieved:', providers);

        res.status(200).json(providers);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        res.status(500).json({ error: 'Failed to fetch providers' });
      }
      break;
      case 'POST':
  try {
   
    const provider = await db.collection('provider').insertOne(req.body);
    if (provider && provider.insertedId) {
      console.log('Provider added:', provider);
      res.status(201).json({ _id: provider.insertedId, ...req.body });
    } else {
      console.error('Failed to add provider: No inserted documents found');
      res.status(400).json({ error: 'Failed to add provider' });
    }
  } catch (error) {
    console.error('Failed to add provider:', error);
    res.status(400).json({ error: 'Failed to add provider' });
  }
  break;


      
    case 'PUT':
      try {
        const { id } = req.query;
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
            const { id } = req.query;
            console.log(`Deleting provider with ID ${id}`);
            await db.collection('provider').deleteOne({ _id: ObjectId(id) });
            res.status(200).json({ message: 'Provider deleted successfully' });
        } catch (error) {
            console.error('Failed to delete provider:', error);
            res.status(400).json({ error: 'Failed to delete provider' });
        }
        break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
