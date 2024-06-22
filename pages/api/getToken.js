// pages/api/getToken.js

export const getAccessToken = async () => {
    const url = `https://login.microsoftonline.com/87369448-76ea-4c62-a43a-1fc6db220b04/oauth2/v2.0/token`;
  
    const data = {
      grant_type: 'client_credentials',
      client_id: 'e481b771-1e6c-4d3f-b8e4-ab39987c87d7',
      client_secret: 'aba8Q~W8gto7Yi61_Nn2enm420ZYVzu_faG8Fdl6',
      scope: 'https://graph.microsoft.com/.default',
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch access token: ${response.statusText}, Details: ${errorDetails}`);
      }
  
      const responseData = await response.json();
      return responseData.access_token;
    } catch (error) {
      console.error('Error in getAccessToken:', error);
      throw error;
    }
  };
  
  export default async function handler(req, res) {
    try {
      const token = await getAccessToken();
      res.status(200).json({ accessToken: token });
    } catch (error) {
      console.error('Error fetching access token:', error);
      res.status(500).json({ error: error.message });
    }
  }
