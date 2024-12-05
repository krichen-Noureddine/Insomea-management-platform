import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { loadEnvConfig } from '@next/env';
import { AlertHistory } from '@/model/AlertHistory';// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Connection string is missing.');
}

const emailClient = new EmailClient(connectionString);

export async function sendExpirationAlert({ to, subject, text }) {
  try {
    // Construct the email content
    const message = {
      senderAddress: 'DoNotReply@312d69aa-774d-411d-aaad-daa5e406f42f.azurecomm.net',
      content: {
        subject,
        plainText: text,
      },
      recipients: {
        to: [{ address: to }],
      },
    };

    // Send the email and poll for the result
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    if (result.status === KnownEmailSendStatus.Succeeded) {
      console.log(`Email sent successfully: ${result.id}`);
      
      // Save sent alert to the database
      await AlertHistory.create({
        recipientEmail: to,
        subject,
        content: text,
        timestamp: new Date(),
        status: 'Succeeded',
        alertType: 'License Expiration'
      });
    } else {
      console.error(`Error sending email: ${result.error}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
