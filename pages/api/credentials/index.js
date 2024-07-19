import clientPromise from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import { verifyCredentials } from "../verifyCredentials";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.connection.db;

        switch (req.method) {
            case 'GET':
                await handleGetRequest(req, res);
                break;
            case 'POST':
                await handlePostRequest(req, res);
                break;
            case 'PUT':
                await handlePutRequest(req, res);
                break;
            case 'DELETE':
                await handleDeleteRequest(req, res);
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
async function handleGetRequest(req, res) {
    const { clientId } = req.query;

    // Function to mask client secrets
    const maskClientSecret = (secret) => {
        if (!secret) return '';
        return secret.slice(0, 3) + '*'.repeat(secret.length - 3);
    };

    try {
        let credentials;

        if (clientId) {
            console.log(`Fetching credentials for clientId: ${clientId}`);

            // Sanitize clientId input
            const sanitizedClientId = String(clientId);

            // Fetch credentials for the provided client ID
            credentials = await Credentials.find({ clientId: sanitizedClientId });

            console.log(`Credentials found for clientId ${clientId}: ${JSON.stringify(credentials)}`);

            if (!credentials.length) {
                return res.status(404).json({ error: 'No credentials found for the provided client ID' });
            }
        } else {
            console.log('Fetching all credentials');

            // Fetch all credentials
            credentials = await Credentials.find();

            console.log(`All credentials found: ${JSON.stringify(credentials)}`);
        }

        // Mask client secrets before sending the response
        const maskedCredentials = credentials.map(credential => ({
            ...credential._doc, // Assuming Mongoose Document
            clientSecret: maskClientSecret(credential.clientSecret)
        }));

        res.status(200).json(maskedCredentials);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            description: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while fetching credentials'
        });
    }
}

// Handle POST request
async function handlePostRequest(req, res) {
    try {
        const { clientId, tenantId, clientSecret, azureClientId, expirationDate } = req.body;
        const newCredentials = new Credentials({ clientId, tenantId, clientSecret, azureClientId, expirationDate });

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
async function handlePutRequest(req, res) {
    const { id } = req.query;
    try {
        const { clientId, tenantId, clientSecret, azureClientId, expirationDate } = req.body;

        // Verify credentials before updating
        const verificationResult = await verifyCredentials(azureClientId, tenantId, clientSecret);
        if (!verificationResult.valid) {
            return res.status(400).json({ error: verificationResult.error, description: verificationResult.description });
        }

        const updatedCredentials = await Credentials.findByIdAndUpdate(id, { clientId, tenantId, clientSecret, azureClientId, expirationDate }, { new: true });
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
async function handleDeleteRequest(req, res) {
    const { id } = req.query;
    try {
        const deletedCredentials = await Credentials.findByIdAndDelete(id);
        if (!deletedCredentials) {
            return res.status(404).json({ error: 'Credentials not found', description: 'No credentials found with the provided ID' });
        }
        res.status(200).json({ message: 'Credentials deleted successfully', credentials: deletedCredentials });
    } catch (error) {
        console.error('Error deleting credentials:', error);
        res.status(500).json({ error: 'Internal Server Error', description: error.message });
    }
}