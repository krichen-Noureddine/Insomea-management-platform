import clientPromise from "@/database/mongodb";
const { ObjectId } = require('mongodb');

export default async function handler(req, res) {
    const {
        query: { id },
        method,
        body,
    } = req;

    const client = await clientPromise;
    const collection = client.db().collection('clients');

    switch (method) {
        case 'GET':
            try {
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: 'Invalid client ID format' });
                }

                const objectId = new ObjectId(id);
                const clientData = await collection.findOne({ _id: objectId });

                if (!clientData) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                return res.status(200).json(clientData);
            } catch (error) {
                console.error('Fetch error:', error);
                return res.status(500).json({ error: 'Server error while fetching client', details: error.message });
            }
        case 'PUT':
            try {
                // Validation Example: Ensure ID is valid
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: 'Invalid client ID format' });
                }

                const objectId = new ObjectId(id);
                const updateData = { ...body };
                delete updateData._id; // Exclude immutable _id field from update payload

                // More rigorous validation can be added here
                // For example, checking for required fields, field formats, etc.

                const updateResult = await collection.updateOne(
                    { _id: objectId },
                    { $set: updateData }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                if (updateResult.modifiedCount === 0) {
                    // No changes made to the document
                    return res.status(200).json({ message: 'No changes detected or applied' });
                }

                // Fetch and return the updated document
                const updatedClient = await collection.findOne({ _id: objectId });
                return res.status(200).json(updatedClient);

            } catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ error: 'Server error while updating client', details: error.message });
            }
        case 'DELETE':
            try {
                const objectId = new ObjectId(id);
                const result = await collection.deleteOne({ _id: objectId });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Client deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Client not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
            break;
        
        // You can add a case for 'GET' here if you need to fetch individual client data

        default:
            res.setHeader('Allow', ['DELETE', 'PUT']); // Include 'GET' if implemented
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
