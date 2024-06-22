import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
  
    const db = client.connection.db; // Use client.db('yourDatabaseName') if your db name is not the default one

    switch (req.method) {
        case 'GET':
            // Fetch all subscriptions
            try {
                const subscriptions = await db.collection('azureSubscriptions').find({}).toArray();
                res.status(200).json(subscriptions);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch subscriptions' });
            }
            break;

            case 'POST':
                try {
                    const subscriptionData = req.body; // Ensure your client sends JSON data
                    console.log('Received subscription data:', subscriptionData); // Log the received data
            
                    // Add basic validation or sanitation as necessary
                    if (!subscriptionData || !subscriptionData.clientName || !subscriptionData.subscriptionName) {
                        return res.status(400).json({ error: 'Missing required fields' });
                    }
            
                    const result = await db.collection('azureSubscriptions').insertOne(subscriptionData);
            
                    if (!result.acknowledged) {
                        throw new Error('Subscription creation failed');
                    }
            
                    const insertedId = result.insertedId; // Get the ID of the inserted document
                    res.status(201).json({ _id: insertedId, ...subscriptionData }); // Include the inserted ID in the response
                } catch (error) {
                    res.status(500).json({ error: error.message || 'An error occurred while creating the subscription' });
                }
                break;
            

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
