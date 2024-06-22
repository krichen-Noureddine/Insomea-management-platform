// api/clients.js
import Client from "@/model/client";
import clientPromise from "@/database/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.connection.db;

        switch (req.method) {
            case 'GET':
                if (req.query.type === 'counts') {
                    const organizationTypeCounts = await Client.aggregate([
                        { $group: { _id: "$organizationType", count: { $sum: 1 } } }
                    ]);
                    res.status(200).json({
                        message: 'Organization Type Counts Retrieved Successfully',
                        organizationTypeCounts: organizationTypeCounts.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {})
                    });
                } else {
                    const clients = await Client.find();
                    res.status(200).json(clients);
                }
                break;
            case 'POST':
                const newClient = new Client(req.body);
            
                await newClient.save();
                res.status(201).json({ message: 'Client added successfully', insertedId: newClient._id });
                break;
            case 'DELETE':
                const clientId = req.query.id;
                const result = await Client.findByIdAndUpdate(clientId, { updatedAt: new Date() });
                if (!result) {
                    return res.status(404).json({ error: 'Client not found' });
                }
                const deleteResult = await Client.deleteOne({ _id: clientId });
                if (deleteResult.deletedCount === 1) {
                    res.status(200).json({ message: 'Client deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Client not found' });
                }
                break;
            default:
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
