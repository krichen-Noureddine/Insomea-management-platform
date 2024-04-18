// pages/api/subscription/[id].js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../database/mongodb'; // Adjust the path as necessary

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    const client = await clientPromise;
    const db = client.db(); // Assuming your database name is set in mongodb.js or use client.db('yourDatabaseName');

    switch (method) {
        case 'GET':
            // Fetch a single subscription by ID
            try {
                const subscription = await db.collection('azureSubscriptions').findOne({ _id: new ObjectId(id) });
                if (!subscription) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }
                res.status(200).json(subscription);
            } catch (error) {
                res.status(500).json({ error: 'Error fetching the subscription' });
            }
            break;

        case 'PUT':
            // Update a subscription by ID
            try {
                const data = req.body;
                const { value: updatedSubscription } = await db.collection('azureSubscriptions').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: data },
                    { returnDocument: 'after' } // Changed from returnOriginal due to driver updates
                );
                if (!updatedSubscription) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }
                res.status(200).json(updatedSubscription);
            } catch (error) {
                res.status(500).json({ error: 'Error updating the subscription' });
            }
            break;

        case 'DELETE':
            // Delete a subscription by ID
            try {
                const { deletedCount } = await db.collection('azureSubscriptions').deleteOne({ _id: new ObjectId(id) });
                if (deletedCount === 0) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }
                res.status(204).end(); // Successfully deleted the subscription
            } catch (error) {
                res.status(500).json({ error: 'Error deleting the subscription' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
