import { ConfidentialClientApplication } from '@azure/msal-node';
import { DefaultAzureCredential } from '@azure/identity';
import { CostManagementClient } from '@azure/arm-costmanagement';

export default async function handler(req, res) {
    const config = {
        auth: {
            clientId: "e481b771-1e6c-4d3f-b8e4-ab39987c87d7",
            authority: "https://login.microsoftonline.com/87369448-76ea-4c62-a43a-1fc6db220b04",
            clientSecret: "aba8Q~W8gto7Yi61_Nn2enm420ZYVzu_faG8Fdl6",
        }
    };

    const cca = new ConfidentialClientApplication(config);
    const clientCredentialRequest = {
        scopes: ["https://management.azure.com/.default"],
    };

    try {
        const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
        const accessToken = response.accessToken;

        const credential = new DefaultAzureCredential();
        const client = new CostManagementClient(credential, 'd52f78b8-5610-4cbc-8ce0-960cac1bbb77');

        // Adjusted to use a valid timeframe parameter if applicable
        const query = {
            type: "Usage",
            timeframe: "Custom", // This line is crucial, make sure it matches API expectations
            timePeriod: { from: "2022-01-01", to: "2022-01-31" },
            dataset: {
                granularity: "Daily",
            },
        };

        const costData = await client.query.usage('subscriptions/d52f78b8-5610-4cbc-8ce0-960cac1bbb77', query);

        res.status(200).json(costData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
