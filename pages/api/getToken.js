import { ConfidentialClientApplication } from '@azure/msal-node';
import fetch from 'node-fetch';

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

        const costQueryResponse = await fetch(`https://management.azure.com/subscriptions/d52f78b8-5610-4cbc-8ce0-960cac1bbb77/providers/Microsoft.CostManagement/query?api-version=2019-11-01`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "Usage",
                timeframe: "MonthToDate",
                dataset: {
                    granularity: "Daily",
                    aggregation: {
                        totalCost: {
                            name: "PreTaxCost",
                            function: "Sum"
                        }
                    }
                }
            })
        });

        if (!costQueryResponse.ok) {
            throw new Error(`Failed to fetch cost data: ${costQueryResponse.statusText}`);
        }

        const costData = await costQueryResponse.json();

        // Combine or choose which data to send back in your response
        res.status(200).json(costData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
