import ServiceCost from '@/model/serviceCost';
import TotalCost from '@/model/totalCost';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { ClientSecretCredential } from "@azure/identity";
import { CostManagementClient } from '@azure/arm-costmanagement';
import clientPromise from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import Subscription from "@/model/azureSub";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const { clientId, date } = req.query;
    if (!date ||  !clientId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const client = await clientPromise;

        const credentials = await Credentials.findOne({ clientId: String(clientId) });
        if (!credentials) {
            return res.status(404).json({ error: "No credentials found for the provided client ID" });
        }

        const subscriptions = await Subscription.find({ clientId: String(clientId) });
        if (!subscriptions.length) {
            return res.status(404).json({ error: "No subscriptions found for the provided client ID" });
        }

        const config = {
            auth: {
                clientId: credentials.azureClientId,
                authority: `https://login.microsoftonline.com/${credentials.tenantId}`,
                clientSecret: credentials.clientSecret,
            }
        };

        const cca = new ConfidentialClientApplication(config);
        const clientCredentialRequest = {
            scopes: ["https://management.azure.com/.default"],
        };

        const tokenResponse = await cca.acquireTokenByClientCredential(clientCredentialRequest);
        if (!tokenResponse || !tokenResponse.accessToken) {
            console.error('Failed to retrieve access token');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const credential = new ClientSecretCredential(credentials.tenantId, credentials.azureClientId, credentials.clientSecret);
        const costManagementClient = new CostManagementClient(credential, credentials.subscriptionId);

        const queryConfig = {
            type: "Usage",
            timeframe: "Custom",
            timePeriod: { from: date,
                to: date },
            granularity: "None",
            dataset: {
                aggregation: {
                    totalCost: { name: "PreTaxCost", function: "Sum" },
                    totalUsage: { name: "UsageQuantity", function: "Sum" }
                },
                grouping: [
                    { type: "Dimension", name: "ServiceName" },
                    { type: "Dimension", name: "ResourceLocation" },
                    { type: "Dimension", name: "MeterCategory" },
                    { type: "Dimension", name: "SubscriptionName" }
                ],
                sorting: [{ direction: "Descending", name: "PreTaxCost" }]
            }
        };

        const allFormattedData = [];
        let totalCost = 0;

        for (const subscription of subscriptions) {
            const costData = await costManagementClient.query.usage('subscriptions/' + subscription.subscriptionId, queryConfig);
            if (!costData || !costData.rows) {
                console.log(`No cost data received for subscription ${subscription.subscriptionId}`);
                continue;
            }
console.log(costData);
            const formattedData = costData.rows.map(row => ({
                _id: uuidv4(),
                subscriptionId: subscription.subscriptionId,
                cost: parseFloat(row[0]),
                usage: parseFloat(row[1]),
                date: new Date(date),
                service: row[2],
                resourceLocation: row[3],
                category: row[4],
                subscriptionName: row[5],
                currency: row[6]
            }));

            // Insert the formatted data into the database
            await ServiceCost.insertMany(formattedData);

            totalCost += formattedData.reduce((sum, data) => sum + data.cost, 0);
            allFormattedData.push(...formattedData);
        }

        const totalCostEntry = new TotalCost({
            clientId: clientId,
            totalCost: totalCost,
            date: new Date(),
        });
        await totalCostEntry.save();

        res.status(200).json({ data: allFormattedData });
    } catch (error) {
        console.error('Failed to fetch or save data:', error);
        res.status(500).json({ error: `Failed to fetch or save data: ${error.message}` });
    }
}
