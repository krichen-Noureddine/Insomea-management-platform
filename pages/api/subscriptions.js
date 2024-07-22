import { ClientSecretCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import clientPromise from "@/database/mongodb";
import { Credentials } from "@/model/Credentials";
import Subscription from "@/model/azureSub";

export default async function handler(req, res) {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: "clientId query parameter is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.connection.db;
    const credentials = await Credentials.findOne({ clientId: String(clientId) });

    if (!credentials) {
      return res.status(404).json({ error: "No credentials found for the provided client ID" });
    }

    const { tenantId, azureClientId, clientSecret } = credentials;

    const credential = new ClientSecretCredential(
      tenantId,
      azureClientId,
      clientSecret,
      {
        allowInsecureConnection: true 
      }
    );

    const subscriptionClient = new SubscriptionClient(credential);
    const subscriptionDetails = [];

  

    for await (const item of subscriptionClient.subscriptions.list()) {

      const subscription = await subscriptionClient.subscriptions.get(item.subscriptionId);
      
      const azureSubscription = {
        subscriptionId: item.subscriptionId,
        clientId: clientId,
        tenantId: tenantId, // Adding tenantId
        subscriptionName: item.displayName,
        status: item.state,
        tags: item.tags,
        azureOffer: item.subscriptionPolicies?.quotaId,
        azureProvider: item.authorizationSource,
        authorizationSource: item.authorizationSource,
        subscriptionPolicies: item.subscriptionPolicies,
        provisioningState: subscription.provisioningState // Adding provisioning state
      };

      subscriptionDetails.push(azureSubscription);
    }

    console.log(`Total subscriptions fetched: ${subscriptionDetails.length}`);

    // Refresh the database with the latest subscriptions
    await Subscription.deleteMany({ clientId: String(clientId) });
    await Subscription.insertMany(subscriptionDetails);

    return res.status(200).json({ value: subscriptionDetails });
  } catch (error) {
    console.error("Failed to fetch and refresh subscriptions:", error);
    return res.status(500).json({ message: "Failed to fetch and refresh subscriptions", error: error.message });
  }
}
