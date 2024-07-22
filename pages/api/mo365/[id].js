import clientPromise from '../../../database/mongodb'; // Adjust the import path as necessary
import License from '@/model/liscence'; // Import the License model

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            // Fetch a single Mo365 subscription by ID
            try {
                if (!id) {
                    return res.status(400).json({ error: 'ID query parameter is required' });
                }

                const subscription = await License.findOne({ _id: id }); // Query by _id as a string

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
