import { ConfidentialClientApplication } from '@azure/msal-node';
import { DefaultAzureCredential } from '@azure/identity';
import { CostManagementClient } from '@azure/arm-costmanagement';
import ServiceCostData from '@/model/serviceCost'; // Adjust path as necessary

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { from, to } = req.query;

            if (!from || !to) {
                return res.status(400).json({ error: 'Missing required parameters: from and to dates are required.' });
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

            const tokenResponse = await cca.acquireTokenByClientCredential(clientCredentialRequest);
            if (!tokenResponse || !tokenResponse.accessToken) {
                console.error('Failed to retrieve access token');
                return res.status(401).json({ error: 'Authentication failed' });
            }

            const credential = new DefaultAzureCredential();
            const costManagementClient = new CostManagementClient(credential, 'c8574be0-b378-45b4-a80a-0f5a4e478ea4');

            const queryConfig = {
                type: "Usage",
                timeframe: "Custom",
                timePeriod: { from, to },
                dataset: {
                    aggregation: {
                        totalCost: {
                            name: "PreTaxCost",
                            function: "Sum"
                        }
                    },
                    grouping: [
                        { type: "Dimension", name: "ResourceType" }, // Valid dimension
                        { type: "Dimension", name: "ResourceLocation" }, // Valid dimension
                        { type: "Dimension", name: "ResourceGroupName" } // Valid dimension
                       

                    ]
                }
            };
            

            const costData = await costManagementClient.query.usage('subscriptions/c8574be0-b378-45b4-a80a-0f5a4e478ea4', queryConfig);

            const formattedData = costData.rows.map(row => ({
                currency: row[4],
                resourceType: row[1],
                location: row[2],
                resourceGroupName: row[3],
                cost: parseFloat(row[0])
            }));

            res.status(200).json({ costData });
        } else {
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error retrieving daily cost data:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
