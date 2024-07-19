import { promises as fs } from 'fs';
import { join } from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import clientPromise from '@/database/mongodb';
import Historique from '@/model/historique';
import Client from '@/model/client';
import Subscription from '@/model/azureSub';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.connection.db;

  if (req.method === 'POST') {
    try {
      const { filters } = req.body;

      const query = {};

      if (filters.companyName) {
        const clientData = await Client.findOne({ companyName: filters.companyName });
        if (!clientData) {
          return res.status(404).json({ error: 'Client not found' });
        }
        query.client_id = clientData._id;
      }

      if (filters.subscriptionName) {
        const subscription = await Subscription.findOne({ subscriptionName: filters.subscriptionName });
        if (!subscription) {
          return res.status(404).json({ error: 'Subscription not found' });
        }
        query.subscription_id = subscription.subscriptionId;
      }

      if (filters.startDate && filters.endDate) {
        query.date = {
          $gte: new Date(filters.startDate).toISOString(),
          $lte: new Date(filters.endDate).toISOString(),
        };
      }

      const historiqueRecords = await Historique.find(query).populate('client_id', 'companyName').exec();

      if (historiqueRecords.length === 0) {
        return res.status(404).json({ error: 'No historique records found' });
      }

      const recordsToWrite = historiqueRecords.map(record => ({
        service: record.service,
        cost: record.cost,
        usage: record.usage,
        date: record.date,
        resource_location: record.resource_location,
        category: record.category,
        currency: record.currency,
      }));

      const csvFileName = `${filters.companyName}-${filters.subscriptionName}.csv`;
      const csvFilePath = join(process.cwd(), 'public', csvFileName);

      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
          { id: 'service', title: 'Service' },
          { id: 'cost', title: 'Cost' },
          { id: 'usage', title: 'Usage' },
          { id: 'date', title: 'Date' },
          { id: 'resource_location', title: 'Resource Location' },
          { id: 'category', title: 'Category' },
          { id: 'currency', title: 'Currency' },
        ],
      });

      await csvWriter.writeRecords(recordsToWrite);

      res.status(200).json({ csvUrl: `/${csvFileName}` });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
