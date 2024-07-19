//api/Dashboard/config.js

const { ConfidentialClientApplication } = require("@azure/msal-node");

// Configuration for the MSAL node, to be used for obtaining tokens for Power BI
const msalConfigNode = {
    auth: {
       
        clientId: "e481b771-1e6c-4d3f-b8e4-ab39987c87d7",
        authority: "https://login.microsoftonline.com/87369448-76ea-4c62-a43a-1fc6db220b04",
        clientSecret: "aba8Q~W8gto7Yi61_Nn2enm420ZYVzu_faG8Fdl6", 
    }
};

const confidentialClientApplication = new ConfidentialClientApplication(msalConfigNode);


export async function getPowerBiAccessToken() {
    try {
        const tokenResponse = await confidentialClientApplication.acquireTokenByClientCredential({
            scopes: ["https://analysis.windows.net/powerbi/api/.default"],
        });
        console.log('Token:', tokenResponse.accessToken); // Log the token here
        return tokenResponse.accessToken;
    } catch (error) {
        console.error('Failed to acquire token:', error);
        throw new Error('Error acquiring token for Power BI');
    }
}

