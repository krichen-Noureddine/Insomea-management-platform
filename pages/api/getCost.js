// pages/api/subscriptions.js
import ServiceCost from '@/model/serviceCost'; // Adjust the path as needed
import { ConfidentialClientApplication } from '@azure/msal-node';
import { DefaultAzureCredential } from '@azure/identity';
import { CostManagementClient } from '@azure/arm-costmanagement';
import mongoose from 'mongoose';

function formatDate(numericDate) {
    const dateString = numericDate.toString();
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`; // Removed extra quotes
}

export default async function handler(req, res) {
    const { from, to, subscriptionId } = req.query;
    if (!from || !to || !subscriptionId) {
        return res.status(400).json({ error: 'Missing required parameters: from, to, and subscriptionId are required.' });
    }

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
        const tokenResponse = await cca.acquireTokenByClientCredential(clientCredentialRequest);
        if (!tokenResponse || !tokenResponse.accessToken) {
            console.error('Failed to retrieve access token');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const credential = new DefaultAzureCredential();
        const costManagementClient = new CostManagementClient(credential, subscriptionId);

        const queryConfig = {
            type: "Usage",
            timeframe: "Custom",
            timePeriod: { from, to },
            dataset: {
                aggregation: {
                    totalCost: {
                        name: "PreTaxCost",
                        function: "Sum"
                    },
                    totalUsage: {
                        name: "UsageQuantity",
                        function: "Sum"
                    }
                },
                grouping: [
                    { type: "Dimension", name: "ServiceName" },
                ],
                granularity: "Daily",
            }
        };

        const costData = await costManagementClient.query.usage('subscriptions/' + subscriptionId, queryConfig);
        if (!costData || !costData.rows) {
            console.log('No cost data received');
            return res.status(204).json({ message: 'No data available for the provided date range' });
        }

        const formattedData = costData.rows.map(row => ({
            subscriptionId,
            cost: parseFloat(row[0]),
            usage: parseFloat(row[1]),
            date: formatDate(row[2]),
            service: row[3],
            currency: row[4]
        }));

        for (const data of formattedData) {
            const exists = await ServiceCost.findOne({
                date: data.date,
                service: data.service,
                subscriptionId: data.subscriptionId
            });
            if (!exists) {
                await ServiceCost.create(data);
            } else {
                console.log('Data already exists, skipping insert');
            }
        }

        res.status(200).json({ data: formattedData });
    } catch (error) {
        console.error('Failed to fetch or save data:', error);
        res.status(500).json({ error: `Failed to fetch or save data: ${error.message}` });
    }
}
