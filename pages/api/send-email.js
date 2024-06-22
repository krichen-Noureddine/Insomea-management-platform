import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { URL } from 'url';

// Initialize the EmailClient with your connection string
const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Connection string is missing.');
}

const emailClient = new EmailClient(connectionString);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const message = {
      senderAddress: 'DoNotReply@6062c76e-9be8-4d0d-a076-de21a86b91d2.azurecomm.net',
      content: {
        subject,
        plainText: text,
        html: html || `<html><body>${text}</body></html>`,
      },
      recipients: {
        to: [{ address: to, displayName: to }]
      }
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    if (result.status === KnownEmailSendStatus.Succeeded) {
      return res.status(200).json({ messageId: result.id });
    } else {
      console.error(`Error sending email: ${result.error}`);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
