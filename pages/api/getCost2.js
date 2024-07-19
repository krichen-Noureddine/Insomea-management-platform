import ServiceCost from '@/model/serviceCost'; // Adjust the path as needed
import TotalCost from '@/model/totalCost'; // Import TotalCost model
import { ConfidentialClientApplication } from '@azure/msal-node';
import { ClientSecretCredential } from "@azure/identity";
import { CostManagementClient } from '@azure/arm-costmanagement';
import mongoose from 'mongoose';
import clientPromise from "@/database/mongodb";

import { Credentials } from "@/model/Credentials";
import Subscription from "@/model/azureSub";

export default async function handler(req, res) {
    const { clientId, from, to } = req.query;
    if (!from || !to || !clientId) {
        return res.status(400).json({ error: 'Missing required parameters: from, to, and clientId are required.' });
    }

    try {
        const client = await clientPromise;
        const db = client.connection.db;

        const credentials = await Credentials.findOne({ clientId: String(clientId) });
        if (!credentials) {
            return res.status(404).json({ error: "No credentials found for the provided client ID" });
        }

        const subscriptions = await Subscription.find({ clientId: String(clientId) });
        if (!subscriptions.length) {
            return res.status(404).json({ error: "No subscriptions found for the provided client ID" });
        }

        const credential = new ClientSecretCredential(credentials.tenantId, credentials.azureClientId, credentials.clientSecret);
        const costManagementClient = new CostManagementClient(credential, credentials.subscriptionId);

        const queryConfig = {
            type: "ActualCost",
            timeframe: "Custom",
            timePeriod: { from, to },
            dataset: {
                granularity: "None",
                aggregation: {
                    totalCost: {
                        name: "Cost",
                        function: "Sum",
                    },
                    totalCostUSD: {
                        name: "CostUSD",
                        function: "Sum",
                    },
                },
                sorting: [
                    { direction: "descending", name: "Cost" },
                ],
                grouping: [
                    { type: "Dimension", name: "ServiceName" },
                    { type: "Dimension", name: "ResourceLocation" },
                    { type: "Dimension", name: "MeterCategory" },
                    { type: "Dimension", name: "SubscriptionName" }
                ],
            }
        };
        

        const allRawData = [];

        for (const subscription of subscriptions) {
            const costData = await costManagementClient.query.usage('subscriptions/' + subscription.subscriptionId, queryConfig);
            if (!costData || !costData.rows) {
                console.log(`No cost data received for subscription ${subscription.subscriptionId}`);
                continue;
            }

            // Add raw costData.rows directly to the array
            allRawData.push(costData.rows);
        }

        // Return allRawData in the response
        res.status(200).json({ data2: allRawData });
    } catch (error) {
        console.error('Failed to fetch or save data:', error);
        res.status(500).json({ error: `Failed to fetch or save data: ${error.message}` });
    }
}
