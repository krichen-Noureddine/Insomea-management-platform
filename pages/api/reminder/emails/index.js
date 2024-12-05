// pages/api/reminder/emails.js

import clientPromise from '@/database/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.connection.db;

  switch (req.method) {
    case 'GET':
      try {
        // Retrieve all emails from the 'Email' collection
        const emails = await db.collection('Email').find({}).toArray();
        res.status(200).json(emails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
      }
      break;

    case 'POST':
      try {
        const { address } = req.body; // Assuming you expect a single email address here

        // Insert the email address into the 'Email' collection
        const result = await db.collection('Email').insertOne({ address });

        // Return the inserted document along with its _id
        res.status(200).json({ 
          message: 'Email saved successfully', 
          data: { _id: result.insertedId, address }
        });
      } catch (error) {
        console.error('Error saving email:', error);
        res.status(500).json({ error: 'Failed to save email' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
