import connectToDatabase from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import { verifyCredentials } from "../verifyCredentials";

export default async function handler(req, res) {
    const { clientId, id } = req.query;

    try {
        await connectToDatabase();

        switch (req.method) {
            case 'GET':
                await handleGetRequest(req, res, clientId, id);
                break;
            case 'POST':
                await handlePostRequest(req, res);
                break;
            case 'PUT':
                await handlePutRequest(req, res, id);
                break;
            case 'DELETE':
                await handleDeleteRequest(req, res, id);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error handling credentials request:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}

// Handle GET request
async function handleGetRequest(req, res, clientId, id) {
    try {
        let credentials;
        if (clientId) {
            // Fetch credentials by client ID
            console.log(`Fetching credentials for clientId: ${clientId}`);
            credentials = await Credentials.find({ clientId: String(clientId) });
            console.log(`Credentials found: ${JSON.stringify(credentials)}`);
            if (!credentials.length) {
                return res.status(404).json({ error: 'No credentials found for the provided client ID' });
            }
        } else if (id) {
            // Fetch credentials by ID
            console.log(`Fetching credentials for id: ${id}`);
            credentials = await Credentials.findById(String(id));
            console.log(`Credentials found: ${JSON.stringify(credentials)}`);
            if (!credentials) {
                return res.status(404).json({ error: 'Credentials not found' });
            }
        } else {
            // Fetch all credentials
            console.log(`Fetching all credentials`);
            credentials = await Credentials.find();
            console.log(`All credentials found: ${JSON.stringify(credentials)}`);
        }
        res.status(200).json(credentials);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}

// Handle POST request
async function handlePostRequest(req, res) {
    try {
        const { clientId, tenantId, clientSecret, azureClientId } = req.body;
        const newCredentials = new Credentials({ clientId, tenantId, clientSecret, azureClientId });

        // Verify credentials before saving
        const verificationResult = await verifyCredentials(azureClientId, tenantId, clientSecret);
        if (!verificationResult.valid) {
            return res.status(400).json({ error: verificationResult.error, description: verificationResult.description });
        }

        await newCredentials.save();
        res.status(201).json({ message: 'Credentials added successfully', credentials: newCredentials });
    } catch (error) {
        console.error('Error adding credentials:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}

// Handle PUT request
async function handlePutRequest(req, res, id) {
    try {
        if (!id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        const { clientId, tenantId, clientSecret, azureClientId } = req.body;

        // Verify credentials before updating
        const verificationResult = await verifyCredentials(azureClientId, tenantId, clientSecret);
        if (!verificationResult.valid) {
            return res.status(400).json({ error: verificationResult.error, description: verificationResult.description });
        }

        const updatedCredentials = await Credentials.findByIdAndUpdate(String(id), { clientId, tenantId, clientSecret, azureClientId }, { new: true });
        if (!updatedCredentials) {
            return res.status(404).json({ error: 'Credentials not found', description: 'No credentials found with the provided ID' });
        }
        res.status(200).json({ message: 'Credentials updated successfully', credentials: updatedCredentials });
    } catch (error) {
        console.error('Error updating credentials:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}

// Handle DELETE request
async function handleDeleteRequest(req, res, id) {
    try {
        if (!id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        const deletedCredentials = await Credentials.findByIdAndDelete(String(id));
        if (!deletedCredentials) {
            return res.status(404).json({ error: 'Credentials not found', description: 'No credentials found with the provided ID' });
        }
        res.status(200).json({ message: 'Credentials deleted successfully', credentials: deletedCredentials });
    } catch (error) {
        console.error('Error deleting credentials:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}
