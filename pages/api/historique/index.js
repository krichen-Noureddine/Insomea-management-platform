import mongoose from 'mongoose';
import clientPromise from '@/database/mongodb';
import Client from '@/model/client';
import Subscription from '@/model/azureSub';
import Historique from '@/model/historique';

export default async function handler(req, res) {
  const client = await clientPromise;
  
  const db = client.connection.db;
  if (req.method === 'POST') {
    try {
      const { subscriptionId } = req.query;
        
      if (!subscriptionId) {
        return res.status(400).json({ error: 'Subscription ID is required' });
      }

     
      const serviceCosts = await db.collection('servicecosts').find({ subscriptionId }).toArray();

      if (serviceCosts.length === 0) {
        return res.status(404).json({ error: 'No service costs found for the given subscription ID' });
      }

      const subscription = await Subscription.findOne({ subscriptionId });
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      const clientData = await Client.findOne({ _id: subscription.clientId });
      if (!clientData) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      // Prepare historique records
      const historiqueRecords = serviceCosts.map(cost => ({
        client_id: clientData._id,
        subscription_id: subscriptionId,
        subscription_name: subscription.subscriptionName,
        cost: cost.cost,
        usage: cost.usage,
        date: new Date(cost.date).toISOString(),
        service: cost.service,
        resource_location: cost.resourceLocation,
        category: cost.category,
        currency: cost.currency,
      }));

      await Historique.insertMany(historiqueRecords);

      res.status(201).json({ historiqueRecords });
    } catch (error) {
      console.error('Error generating historique data:', error);
      res.status(500).json({ error: 'Failed to generate historique data' });
    }
  } else  if (req.method === 'GET') {
    try {
      const { subscriptionId, companyName, tenantId, startDate, endDate } = req.query;
      const query = {};

      if (subscriptionId) {
        query.subscription_id = subscriptionId;
      }

      if (companyName) {
        const clientData = await Client.findOne({ companyName });
        if (!clientData) {
          return res.status(404).json({ error: 'Client not found' });
        }
        query.client_id = clientData._id;
      }

      if (tenantId) {
        const clientData = await Client.findOne({ tenantId });
        if (!clientData) {
          return res.status(404).json({ error: 'Client not found' });
        }
        query.client_id = clientData._id;
      }

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        };
      }

      // Fetch historique records and populate client details
      const historiqueRecords = await Historique.find(query)
        .populate('client_id', 'companyName') // Populate client's companyName
        .exec();

      if (historiqueRecords.length === 0) {
        return res.status(404).json({ error: 'No historique records found' });
      }

      res.status(200).json({ historiqueRecords });
    } catch (error) {
      console.error('Error fetching historique data:', error);
      res.status(500).json({ error: 'Failed to fetch historique data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}