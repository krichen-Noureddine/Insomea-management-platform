import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.connection.db; // Use client.db('yourDatabaseName') if your db name is not the default one

  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query;
        
        const serviceCosts = await db.collection('servicecosts').find({ clientId: id }).toArray();
        
        res.status(200).json(serviceCosts);
      } catch (error) {
        console.error('Error fetching service costs:', error);
        res.status(500).json({ error: 'Failed to fetch service costs' });
      }
      break;
      
    default:
      res.status(405).end(); 
      break;
  }
}
