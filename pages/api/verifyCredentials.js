export async function verifyCredentials(azureClientId, tenantId, clientSecret) {
    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const resource = 'https://graph.microsoft.com';

    try {
        
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: azureClientId,
                scope: `${resource}/.default`,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            })
        });

        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.json();
            console.error('Failed to obtain access token:', tokenResponse.status, errorDetails);

            throw new Error(errorDetails.error_description || errorDetails.error || 'Failed to obtain access token.');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;


        const detailsResponse = await fetch(`${resource}/v1.0/servicePrincipals?$filter=appId eq '${azureClientId}'`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!detailsResponse.ok) {
            const errorDetails = await detailsResponse.json();
            console.error('Failed to fetch service principal details:', detailsResponse.status, errorDetails);

            throw new Error(errorDetails.error_description || errorDetails.error || 'Failed to fetch service principal details.');
        }

        const detailsData = await detailsResponse.json();
        const servicePrincipalId = detailsData.value[0].id;

        console.log('Service Principal ID obtained:', servicePrincipalId);

        const secretsResponse = await fetch(`${resource}/v1.0/servicePrincipals/${servicePrincipalId}/passwordCredentials`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!secretsResponse.ok) {
            const errorDetails = await secretsResponse.json();
            console.error('Failed to fetch client secrets:', secretsResponse.status, errorDetails);

            throw new Error(errorDetails.error_description || errorDetails.error || 'Failed to fetch client secrets.');
        }

        const secretsData = await secretsResponse.json();

        console.log('Client secrets obtained:', secretsData);

        const clientSecretInfo = secretsData.value.find(secret => secret.customKeyIdentifier === azureClientId);
        const expirationTime = clientSecretInfo ? clientSecretInfo.endDateTime : null;

        console.log('Client secret expiration time:', expirationTime);

        return { valid: true, details: detailsData, expirationTime };
    } catch (error) {
        console.error('Error verifying credentials:', error.message);
        throw new Error(error.message);
    }
}
