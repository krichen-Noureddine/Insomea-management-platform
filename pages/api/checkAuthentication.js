// Import the DefaultAzureCredential class
import { DefaultAzureCredential } from '@azure/identity';

// Define the API handler function
export default async function handler(req, res) {
    // Create an instance of DefaultAzureCredential
    const credential = new DefaultAzureCredential();

    try {
        // Acquire a token silently (without interactive authentication)
        const tokenResponse = await credential.getToken(['https://management.azure.com/.default']);

        // If token acquisition is successful, send a success response
        res.status(200).json({ success: true, accessToken: tokenResponse.token });
    } catch (error) {
        // If an error occurs during token acquisition, send an error response
        console.error('Authentication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
