//api/getMO365Licenses.js
import { getAccessToken, getMO365Licenses, getSubscriptionDetails, getUserLicenseDetails, getBillingInformation, getCompanies, fetchEmailActivityReports, getOrganizationDetails } from '@/utils/microsoftGraph';
import clientPromise from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import License from '@/model/liscence';
const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
const MANAGEMENT_SCOPE = 'https://management.azure.com/.default';
const BC_SCOPE = 'https://api.businesscentral.dynamics.com/.default';

export default async function handler(req, res) {
  const { clientId, action, accessToken, subscriptionId, userId, companyId } = req.query;

  if (!action) {
    return res.status(400).json({ error: "action query parameter is required" });
  }

  try {
    let token;
    let tenantId;

    // If accessToken is not provided, fetch it using clientId
    if (!accessToken) {
      if (!clientId) {
        return res.status(400).json({ error: "clientId query parameter is required for fetching access token" });
      }

      // Connect to the database and fetch credentials by clientId
      const client = await clientPromise;
      const db = client.connection.db;
      const credentials = await Credentials.findOne({ clientId: String(clientId) });

      if (!credentials) {
        return res.status(404).json({ error: "No credentials found for the provided client ID" });
      }

      const { tenantId: storedTenantId, azureClientId, clientSecret } = credentials;
      tenantId = storedTenantId;

      console.log('Fetched credentials:', { tenantId, azureClientId, clientSecret });

      // Get access token using the fetched credentials and correct scope
      switch (action) {
        case 'getMO365Licenses':
        case 'getUserLicenseDetails':
        case 'getBillingInformation':
        case 'fetchEmailActivityReports':
        case 'getOrganizationDetails':
          token = await getAccessToken(tenantId, azureClientId, clientSecret, GRAPH_SCOPE);
          break;
        case 'getSubscriptionDetails':
          token = await getAccessToken(tenantId, azureClientId, clientSecret, MANAGEMENT_SCOPE);
          break;
        case 'getCompanies':
          token = await getAccessToken(tenantId, azureClientId, clientSecret, BC_SCOPE);
          break;
        default:
          return res.status(400).json({ error: "Invalid action parameter" });
      }

      console.log('Fetched access token:', token);
    } else {
      token = accessToken;
    }

    // Handle different actions
    switch (action) {
      case 'getMO365Licenses':
        const licenses = await getMO365Licenses(token);
        for (const licenseData of licenses) {
          await License.updateOne(
            { _id: licenseData.id },
            {
              $set: {
                ...licenseData,
                clientId,
                servicePlans: licenseData.serviceStatus,
              }
            },
            { upsert: true }
          );
        }
        return res.status(200).json({ clientId, value: licenses });

      case 'getSubscriptionDetails':
        if (!subscriptionId) {
          return res.status(400).json({ error: "subscriptionId query parameter is required" });
        }
        const subscriptionDetails = await getSubscriptionDetails(token, subscriptionId);
        return res.status(200).json({ value: subscriptionDetails });

      case 'getUserLicenseDetails':
        if (!userId) {
          return res.status(400).json({ error: "userId query parameter is required" });
        }
        const userDetails = await getUserLicenseDetails(token, userId);
        return res.status(200).json({ value: userDetails });

      case 'getBillingInformation':
        if (!companyId) {
          return res.status(400).json({ error: "companyId query parameter is required" });
        }
        const billingInformation = await getBillingInformation(token, companyId);
        return res.status(200).json({ value: billingInformation });

      case 'getCompanies':
        const companies = await getCompanies(token, tenantId);
        return res.status(200).json({ value: companies });

      case 'fetchEmailActivityReports':
        const emailActivityReports = await fetchEmailActivityReports(token);
        return res.status(200).json({ value: emailActivityReports });

        case 'getOrganizationDetails':
          
          const organizationDetails = await getOrganizationDetails(token);
  
          console.log('Fetched organization details:', organizationDetails);
  
          
          return res.status(200).json({ value: organizationDetails });
      default:
        return res.status(400).json({ error: "Invalid action parameter" });
    }
  } catch (error) {
    console.error("Failed to execute action:", error);
    return res.status(500).json({ message: `Failed to execute action: ${action}`, error: error.message });
  }
}
