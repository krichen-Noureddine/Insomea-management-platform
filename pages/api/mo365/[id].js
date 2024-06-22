import { ObjectId } from 'mongodb';
import clientPromise from '../../../database/mongodb'; // Adjust the import path as necessary

export default async function handler(req, res) {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.connection.db; // Use client.db('yourDatabaseName') if your db name is not the default one

    switch (req.method) {
        case 'GET':
            // Fetch a single Mo365 subscription by ID
            try {
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: 'Invalid ID format' });
                }

                const subscription = await db.collection('licenses').findOne({ _id: new ObjectId(id) });

                if (!subscription) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }

                res.status(200).json(subscription);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch the Mo365 subscription' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
