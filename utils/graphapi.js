import { useMsal } from '@azure/msal-react';

const acquireGraphApiToken = async (instance) => {
  try {
    const authResult = await instance.acquireTokenSilent({
      scopes: ['User.Read', 'Mail.Read'], // Scopes required by your application
    });

    const accessToken = authResult.accessToken; // Access token for Microsoft Graph API
    console.log('Access Token:', accessToken); // Log the access token to the console
    return accessToken;
  } catch (error) {
    console.error('Error acquiring token:', error);
    throw error;
  }
};

export default acquireGraphApiToken;
