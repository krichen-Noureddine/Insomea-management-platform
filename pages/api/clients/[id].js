import { getAccessToken, getOrganizationDetails } from '@/utils/microsoftGraph';
import clientPromise from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import Client from '@/model/client'; // Import Client model

const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

export default async function handler(req, res) {
    const { id, action } = req.query; // Extract action from query
    const { method, body } = req;

    const client = await clientPromise;
    const collection = client.connection.db.collection('clients'); // Update collection name

    switch (method) {
        case 'GET':
            try {
                const clientData = await collection.findOne({ _id: id });

                if (!clientData) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                // Fetch organization details if action is specified
                if (action === 'getOrganizationDetails') {
                    const credentials = await Credentials.findOne({ clientId: String(id) });

                    if (!credentials) {
                        return res.status(404).json({ error: "No credentials found for the provided client ID" });
                    }

                    const { tenantId, azureClientId, clientSecret } = credentials;
                    const accessToken = await getAccessToken(tenantId, azureClientId, clientSecret, GRAPH_SCOPE);
                    const organizationDetails = await getOrganizationDetails(accessToken);

                    const updatedClientData = {
                        ...clientData,
                        organizationDetails: organizationDetails[0]
                    };

                    return res.status(200).json(updatedClientData);
                }

                return res.status(200).json(clientData);
            } catch (error) {
                console.error('Fetch error:', error);
                return res.status(500).json({ error: 'Server error while fetching client', details: error.message });
            }
        case 'PUT':
            try {
                // Fetch access token and organization details if action is specified
                let updateData = { ...body };
                delete updateData._id; // Exclude immutable _id field from update payload

                if (body.action === 'getOrganizationDetails') {
                    const credentials = await Credentials.findOne({ clientId: String(id) });

                    if (!credentials) {
                        return res.status(404).json({ error: "No credentials found for the provided client ID" });
                    }

                    const { tenantId, azureClientId, clientSecret } = credentials;
                    const accessToken = await getAccessToken(tenantId, azureClientId, clientSecret, GRAPH_SCOPE);
                    const organizationDetails = await getOrganizationDetails(accessToken);

                    updateData = {
                        ...updateData,
                        companyName: organizationDetails[0].displayName,
                        clientLocation: organizationDetails[0].city,
                        clientAddress: organizationDetails[0].street,
                        domains: organizationDetails[0].verifiedDomains.map(domain => domain.name),
                    };
                }

                const updateResult = await collection.updateOne(
                    { _id: id },
                    { $set: updateData }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                if (updateResult.modifiedCount === 0) {
                    // No changes made to the document
                    return res.status(200).json({ message: 'No changes detected or applied' });
                }

                // Fetch and return the updated document
                const updatedClient = await collection.findOne({ _id: id });
                return res.status(200).json(updatedClient);
            } catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ error: 'Server error while updating client', details: error.message });
            }
        case 'POST':
            try {
                // Fetch organization details from Graph API
                const credentials = await Credentials.findOne({ clientId: String(id) });

                if (!credentials) {
                    return res.status(404).json({ error: "No credentials found for the provided client ID" });
                }

                const { tenantId, azureClientId, clientSecret } = credentials;
                const accessToken = await getAccessToken(tenantId, azureClientId, clientSecret, GRAPH_SCOPE);
                const organizationDetails = await getOrganizationDetails(accessToken);

                // Update client data with fetched organization details
                const updateData = {
                    companyName: organizationDetails[0].displayName,
                    clientLocation: organizationDetails[0].city,
                    clientAddress: organizationDetails[0].street,
                    domains: organizationDetails[0].verifiedDomains.map(domain => domain.name),
                    businessPhones: organizationDetails[0].businessPhones,
                    country: organizationDetails[0].country,
                    countryLetterCode: organizationDetails[0].countryLetterCode,
                    postalCode: organizationDetails[0].postalCode,
                    preferredLanguage: organizationDetails[0].preferredLanguage,
                    tenantType: organizationDetails[0].tenantType,
                    state: organizationDetails[0].state,
                    street: organizationDetails[0].street,
                    technicalNotificationMails: organizationDetails[0].technicalNotificationMails,
                    marketingNotificationEmails: organizationDetails[0].marketingNotificationEmails,
                    securityComplianceNotificationMails: organizationDetails[0].securityComplianceNotificationMails,
                    securityComplianceNotificationPhones: organizationDetails[0].securityComplianceNotificationPhones,
                    createdDateTime: organizationDetails[0].createdDateTime,
                    defaultUsageLocation: organizationDetails[0].defaultUsageLocation,
                    isMultipleDataLocationsForServicesEnabled: organizationDetails[0].isMultipleDataLocationsForServicesEnabled,
                    onPremisesLastSyncDateTime: organizationDetails[0].onPremisesLastSyncDateTime,
                    onPremisesSyncEnabled: organizationDetails[0].onPremisesSyncEnabled,
                    partnerTenantType: organizationDetails[0].partnerTenantType,
                };

                const updateResult = await collection.updateOne(
                    { _id: id },
                    { $set: updateData }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                if (updateResult.modifiedCount === 0) {
                    // No changes made to the document
                    return res.status(200).json({ message: 'No changes detected or applied' });
                }

                // Fetch and return the updated document
                const updatedClient = await collection.findOne({ _id: id });
                return res.status(200).json(updatedClient);
            } catch (error) {
                console.error('Post error:', error);
                return res.status(500).json({ error: 'Server error while updating client', details: error.message });
            }
        case 'DELETE':
            try {
                const result = await collection.deleteOne({ _id: id });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Client deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Client not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
            break;

        default:
            res.setHeader('Allow', ['DELETE', 'PUT', 'GET', 'POST']); // Include 'POST'
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
