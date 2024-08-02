import schedule from 'node-schedule';
import axios from 'axios';
import { Credentials } from '../model/Credentials.js'; // Import the named export
import clientPromise from '../database/mongodb.js';

const updateSubscriptions = async () => {
  try {
    const client = await clientPromise;
    const db = client.connection.db;
    const clients = await Credentials.find();

    for (const client of clients) {
      try {
        await axios.get(`http://localhost:3000/api/subscriptions?clientId=${client.clientId}`);
      } catch (error) {
        console.error(`Error fetching subscriptions for client ${client.clientId}:`, error.response?.data || error.message);
      }
    }

    console.log('Subscriptions updated successfully');
  } catch (error) {
    console.error('Error updating subscriptions:', error.response?.data || error.message);
  }
};

schedule.scheduleJob('*/1 * * * *', async () => {
  console.log('Scheduled job started');
  await updateSubscriptions();
  console.log('Scheduled job completed');
});

// Remove or comment out the immediate execution for testing
/*
const runImmediately = async () => {
  try {
    console.log('Immediate updateSubscriptions execution started');
    await updateSubscriptions();
    console.log('Immediate updateSubscriptions execution completed');
  } catch (error) {
    console.error('Immediate updateSubscriptions execution failed:', error);
  } finally {
    // Properly close the MongoDB connection
    try {
      const client = await clientPromise;
      await client.connection.close(); // No callback needed
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      process.exit(0); // Exit successfully
    }
  }
};

// Run immediately for testing
runImmediately();
*/

