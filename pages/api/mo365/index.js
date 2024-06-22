import { ObjectId } from 'mongodb';
import clientPromise from '../../../database/mongodb'; // Adjust the import path as necessary

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.connection.db;// Use client.db('yourDatabaseName') if your db name is not the default one

    switch (req.method) {
        case 'GET':
            // Fetch all Mo365 subscriptions
            try {
                const subscriptions = await db.collection('licenses').find({}).toArray();
                res.status(200).json(subscriptions);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch Mo365 subscriptions' });
            }
            break;

          

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
