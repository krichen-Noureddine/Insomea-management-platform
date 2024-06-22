import { ConfidentialClientApplication } from '@azure/msal-node';
import { DefaultAzureCredential } from '@azure/identity';
import { CostManagementClient } from '@azure/arm-costmanagement';

export default async function handler(req, res) {
    const config = {
        auth: {
            clientId: "e481b771-1e6c-4d3f-b8e4-ab39987c87d7",
            authority: "https://login.microsoftonline.com/87369448-76ea-4c62-a43a-1fc6db220b04",
            clientSecret: "aba8Q~W8gto7Yi61_Nn2enm420ZYVzu_faG8Fdl6"
        }
    };

    const cca = new ConfidentialClientApplication(config);
    const clientCredentialRequest = {
        scopes: ["https://management.azure.com/.default"]
    };

    try {
        // Obtain Access Token
        const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
        const accessToken = response.accessToken;

        // Initialize Cost Management Client
        const credential = new DefaultAzureCredential();
        const costManagementClient = new CostManagementClient(credential, 'c8574be0-b378-45b4-a80a-0f5a4e478ea4');

        // Parse query parameters (adjust as needed)
        const { from = "2024-01-01", to = "2024-01-31", granularity = "Daily" } = req.query;

        // Usage Query Template by ResourceId
        const usageQuery = {
            type: "Usage",
            timeframe: "Custom",
            timePeriod: { from, to },
            dataset: {
                granularity,
                aggregation: {
                    totalUsage: {
                        name: "UsageQuantity",
                        function: "Sum"
                    }
                },
                grouping: [
                    {
                        type: "Dimension",
                        name: "ResourceId"
                    }
                ]
            }
        };

        // Get Usage Data
        const usageData = await costManagementClient.query.usage('subscriptions/c8574be0-b378-45b4-a80a-0f5a4e478ea4', usageQuery);

        // Formatting Usage Data
        const formattedRows = usageData.rows.map(row => {
            const [usageQuantity, usageDate, resourceId, currency] = row;
            const formattedDate = `${String(usageDate).substring(0, 4)}-${String(usageDate).substring(4, 6)}-${String(usageDate).substring(6)}`;
            return {
                usageQuantity,
                usageDate: formattedDate,
                resourceId,
                currency
            };
        });

        const formattedResponse = {
            id: usageData.id,
            name: usageData.name,
            type: usageData.type,
            columns: usageData.columns.map(col => col.name),
            rows: formattedRows
        };

        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
