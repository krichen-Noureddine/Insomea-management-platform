import fetch from 'node-fetch';

// Function to get an access token from Azure AD
const getAccessToken = async (tenantId, clientId, clientSecret, scope) => {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body.toString(),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Function to get M365 licenses using Microsoft Graph API
const getMO365Licenses = async (accessToken) => {
  const url = 'https://graph.microsoft.com/beta/directory/subscriptions';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch MO365 licenses');
    }

    const data = await response.json();

    // Ensure prepaidUnits is included in each license, even if it is not returned by the API
    const licensesWithDefaults = data.value.map(license => ({
      ...license,
      prepaidUnits: license.prepaidUnits || {
        enabled: 0,
        suspended: 0,
        warning: 0,
        lockedOut: 0
      }
    }));

    return licensesWithDefaults; // Return the modified data
  } catch (error) {
    console.error('Error fetching MO365 licenses:', error);
    throw error;
  }
};


// Function to fetch additional subscription details if needed
const getSubscriptionDetails = async (accessToken, subscriptionId) => {
  const url = `https://management.azure.com/subscriptions/${subscriptionId}?api-version=2020-01-01`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch subscription details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};

// Function to fetch user license details
const getUserLicenseDetails = async (accessToken, userId) => {
  const url = `https://graph.microsoft.com/v1.0/users/${userId}/licenseDetails`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch user license details');
    }

    const data = await response.json();
    return data.value; // Only returning the relevant data part
  } catch (error) {
    console.error('Error fetching user license details:', error);
    throw error;
  }
};

// Function to fetch billing information using financials endpoint
const getBillingInformation = async (accessToken, companyId) => {
  const url = `https://graph.microsoft.com/v1.0/financials/companies/${companyId}/salesInvoices`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch billing information');
    }

    const data = await response.json();
    return data.value; // Only returning the relevant data part
  } catch (error) {
    console.error('Error fetching billing information:', error);
    throw error;
  }
};


const getCompanies = async (accessToken, tenantId) => {
  const url = `https://api.businesscentral.dynamics.com/v2.0/production/api/v2.0/companies`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'OData-Version': '4.0'
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch companies');
    }

    const data = await response.json();
    return data.value; // Only returning the relevant data part
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};



const fetchEmailActivityReports = async (accessToken) => {
  const url = 'https://graph.microsoft.com/v1.0/reports/getEmailActivityUserDetail(period=\'D30\')';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch email activity reports');
    }

    const data = await response.text();
    return data; // CSV format
  } catch (error) {
    console.error('Error fetching email activity reports:', error);
    throw error;
  }
};
const getOrganizationDetails = async (accessToken) => {
  const url = 'https://graph.microsoft.com/v1.0/organization';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error('Failed to fetch organization details');
    }

    const data = await response.json();
    return data.value; // Only returning the relevant data part
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw error;
  }
};



export { getAccessToken, getMO365Licenses, getSubscriptionDetails, getUserLicenseDetails, getBillingInformation, getCompanies, fetchEmailActivityReports ,getOrganizationDetails};