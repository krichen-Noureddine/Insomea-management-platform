import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.connection.db;

    switch (req.method) {
        case 'GET':
            try {
                const { clientId } = req.query;

                let query = {};
                if (clientId) {
                    query = { clientId: clientId };
                }

                const subscriptions = await db.collection('subscriptions').find(query).toArray();
                res.status(200).json(subscriptions);
                console.log(subscriptions);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch subscriptions' });
            }
            break;

        case 'POST':
            try {
                const subscriptionData = req.body;
                console.log('Received subscription data:', subscriptionData);

                if (!subscriptionData || !subscriptionData.clientName || !subscriptionData.subscriptionName) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const result = await db.collection('azureSubscriptions').insertOne(subscriptionData);

                if (!result.acknowledged) {
                    throw new Error('Subscription creation failed');
                }

                const insertedId = result.insertedId;
                res.status(201).json({ _id: insertedId, ...subscriptionData });
            } catch (error) {
                res.status(500).json({ error: error.message || 'An error occurred while creating the subscription' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
