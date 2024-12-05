//scripts/cron.js
const cron = require('node-cron');
const fetch = require('node-fetch');
const { sendExpirationAlert } = require('@/utils/sendEmail');  // Adjust the path if necessary

// Function to check for expiring licenses
const checkExpiringLicenses = async () => {
  try {
    // Fetch clients and licenses
    const response = await fetch('http://localhost:3000/api/clients');  // Adjust the endpoint
    const clients = await response.json();

    const licensesRes = await fetch('http://localhost:3000/api/mo365');
    const licenses = await licensesRes.json();

    licenses.forEach((license) => {
      const expirationDate = new Date(license.nextLifecycleDateTime);
      if (expirationDate && expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
        const client = clients.find((client) => client._id === license.clientId);
        const subject = `License Expiration Reminder: ${license.skuPartNumber}`;
        const text = `The license ${license.skuPartNumber} for client ${client ? client.companyName : license.clientName} will expire on ${expirationDate.toLocaleDateString()}.`;

        // Send email to manager(s)
        const managerEmails = ['manager@example.com'];  // Replace with actual email logic
        managerEmails.forEach((email) => {
          sendExpirationAlert({
            to: email,
            subject,
            text,
          });
        });
      }
    });
  } catch (error) {
    console.error('Error checking for expiring licenses:', error);
  }
};

// Cron job to run the check every day at 2:05 AM
cron.schedule('5 2 * * *', () => {
  console.log('Running cron job to check for expiring licenses...');
  checkExpiringLicenses();
});
