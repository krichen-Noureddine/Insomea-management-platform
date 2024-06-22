// pages/api/getEmbedUrl.js
import { ClientSecretCredential } from '@azure/identity';
import fetch from 'node-fetch';

const tenantId = '87369448-76ea-4c62-a43a-1fc6db220b04';
const clientId = 'e481b771-1e6c-4d3f-b8e4-ab39987c87d7';
const clientSecret = 'aba8Q~W8gto7Yi61_Nn2enm420ZYVzu_faG8Fdl6';
const groupId = 'myorg'; // Use 'myorg' for My Workspace
const reportId = '55144d1f-a773-4e79-baf6-225f17d2034d';

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://analysis.windows.net/powerbi/api/.default',
      }),
    });
  
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch access token: ${response.statusText}, Details: ${errorDetails}`);
    }
  
    const data = await response.json();
    return data.access_token;
  }
  
  export default async function handler(req, res) {
    try {
      const accessToken = await getAccessToken();
      console.log('Access token fetched:', accessToken);
  
      const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Failed to fetch embed URL:', errorDetails);
        throw new Error(`Failed to fetch embed URL: ${errorDetails}`);
      }
  
      const report = await response.json();
      const embedUrl = report.embedUrl;
  
      res.status(200).json({ embedUrl });
    } catch (error) {
      console.error('Error fetching embed URL:', error);
      res.status(500).json({ error: error.message });
    }
  }