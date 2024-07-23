import dotenv from 'dotenv';
import schedule from 'node-schedule';
import axios from 'axios';
import { Credentials } from '../model/Credentials.js'; // Adjust path as necessary
import clientPromise from '../database/mongodb.js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const updateSubscriptions = async () => {
  try {
    const client = await clientPromise;
    const db = client.connection.db;
    const clients = await Credentials.find();

    console.log('Fetched clients:', clients);

    for (const client of clients) {
      console.log(`Fetching subscriptions for client ID: ${client.clientId}`);
      await axios.get(`http://localhost:3000/api/subscriptions?clientId=${client.clientId}`);
    }

    console.log('Subscriptions updated successfully');
  } catch (error) {
    console.error('Error updating subscriptions:', error);
  }
};

// Schedule the job to run every day at midnight
schedule.scheduleJob('0 0 * * *', updateSubscriptions);

// Optionally run the updateSubscriptions immediately for testing
updateSubscriptions().then(() => {
  console.log('Immediate updateSubscriptions execution completed');
}).catch(error => {
  console.error('Immediate updateSubscriptions execution failed:', error);
});
