import { verifyCredentials } from "./verifyCredentials";


export default async function handler(req, res) {
    const { azureClientId, tenantId, clientSecret } = req.query;

    if (!azureClientId || !tenantId || !clientSecret) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const result = await verifyCredentials(azureClientId, tenantId, clientSecret);
        if (result.valid) {
            res.status(200).json({ expirationTime: result.expirationTime });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error("Error fetching expiration time:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
