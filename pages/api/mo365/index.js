//mo365/index.js
import clientPromise from '../../../database/mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.connection.db;

    switch (req.method) {
        case 'GET':
            try {
                // Fetch all Mo365 subscriptions with client names
                const subscriptions = await db.collection('licenses').aggregate([
                    {
                        $lookup: {
                            from: 'clients',
                            localField: 'clientId',
                            foreignField: '_id',
                            as: 'client'
                        }
                    },
                    {
                        $unwind: '$client'
                    },
                    {
                        $project: {
                            _id: 1,
                            clientId: 1,
                            clientName: '$client.companyName', // Adjust the field name based on your schema
                            status: 1,
                            skuPartNumber: 1,
                            createdDateTime: 1,
                            nextLifecycleDateTime: 1
                        }
                    }
                ]).toArray();

                res.status(200).json(subscriptions);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch Mo365 subscriptions' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
