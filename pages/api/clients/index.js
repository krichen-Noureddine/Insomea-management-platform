import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const collection = client.db().collection('clients');

  try {
    if (req.method === 'GET') {
      // Handle GET request to retrieve clients
      const clients = await collection.find().toArray();
      res.status(200).json(clients);
    } else if (req.method === 'POST') {
      // Handle POST request to add a new client
      const newClient = req.body;

      // Validate the new client data here if needed
      if (!newClient || Object.keys(newClient).length === 0) {
        throw new Error('Invalid client data');
      }

      const result = await collection.insertOne(newClient);

      if (!result || !result.insertedId) {
        throw new Error('Failed to insert client');
      }

      res.status(201).json({ insertedId: result.insertedId });
    } else if (req.method === 'DELETE') {
      // Handle DELETE request: Delete a client
      const clientId = req.query.id;

      // Convert string ID to MongoDB ObjectId
      let objectId;
      try {
        objectId = new ObjectId(clientId);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const result = await collection.deleteOne({ _id: objectId });
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Client deleted successfully' });
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } else {
      // Handle unsupported HTTP methods
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}