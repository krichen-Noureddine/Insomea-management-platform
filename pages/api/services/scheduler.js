import schedule from 'node-schedule';
import fetch from 'node-fetch';  // Import node-fetch
import clientPromise from '../database/mongodb.js'; // Adjust the path as necessary
import Credentials from '../models/Credentials.js'; // Adjust the path as necessary

const updateSubscriptions = async () => {
  try {
    const client = await clientPromise;
    const db = client.connection.db;
    const clients = await Credentials.find();

    for (const client of clients) {
      const url = `http://localhost:3000/api/subscriptions?clientId=${client.clientId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Assuming you need to process the response
      console.log('Received data:', data);
    }

    console.log('Subscriptions updated successfully');
  } catch (error) {
    console.error('Error updating subscriptions:', error);
  }
};

// Schedule the job to run every day at midnight
const scheduleJobs = () => {
  schedule.scheduleJob('0 0 * * *', updateSubscriptions);
};

// Optionally run the updateSubscriptions immediately for testing
const runImmediateUpdate = async () => {
  try {
    await updateSubscriptions();
    console.log('Immediate updateSubscriptions execution completed');
  } catch (error) {
    console.error('Immediate updateSubscriptions execution failed:', error);
  }
};

// Export the scheduler function
export { scheduleJobs, runImmediateUpdate };
