// pages/api/Dashboard.js

const axios = require('axios');

const tenantId = 'b5ddb5f6-c713-48e9-a93d-d9fa7d6d6ae8';
const clientId = 'b7ba4546-09d8-4ff8-a8a4-2c9f8f31ac34';
const clientSecret = '61M8Q~cVqgPblmfZAxPQLq6Wd6xRZ4nZy~YJkbFu';

const getAccessToken = async () => {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

  try {
    const response = await axios.post(url, params);
    return response.data.access_token;
  } catch (error) {

if (error.response) {
      console.error('Error response from server:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = await getAccessToken();
    if (token) {
      res.status(200).json({ accessToken: token });
    } else {
      res.status(500).json({ error: 'Failed to get access token' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
