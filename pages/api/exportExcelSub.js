import { join } from 'path';
import * as XLSX from 'xlsx';
import clientPromise from '@/database/mongodb';
import Subscription from '@/model/azureSub';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.connection.db;

  if (req.method === 'POST') {
    try {
      const subscriptionRecords = await Subscription.find({}).exec();

      if (subscriptionRecords.length === 0) {
        return res.status(404).json({ error: 'No subscription records found' });
      }

      const recordsToWrite = await Promise.all(
        subscriptionRecords.map(async (subscription) => {
          try {
            const clientResponse = await fetch(`http://localhost:3000/api/clients/${subscription.clientId}`);
            if (!clientResponse.ok) {
              throw new Error(`Failed to fetch client data for clientId: ${subscription.clientId}`);
            }
            const clientData = await clientResponse.json();

            return {
              companyName: clientData.companyName ?? 'Unknown',  // Ensure fallback only if companyName is absent
              tenantId: subscription.tenantId,
              subscriptionName: subscription.subscriptionName,
              subscriptionId: subscription.subscriptionId,
              status: subscription.status,
              azureOffer: subscription.azureOffer,
              updatedAt: subscription.updatedAt,
            };
          } catch (error) {
            console.error('Error fetching company name for subscription:', subscription.clientId, error);
            return {
              companyName: 'Unknown',
              tenantId: subscription.tenantId,
              subscriptionName: subscription.subscriptionName,
              subscriptionId: subscription.subscriptionId,
              status: subscription.status,
              azureOffer: subscription.azureOffer,
              updatedAt: subscription.updatedAt,
            };
          }
        })
      );

      const ws = XLSX.utils.json_to_sheet(recordsToWrite);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Subscriptions');
      const excelFileName = 'subscriptions.xlsx';
      const excelFilePath = join(process.cwd(), 'public', excelFileName);
      XLSX.writeFile(wb, excelFilePath);

      res.status(200).json({ excelUrl: `/${excelFileName}` });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      res.status(500).json({ error: 'Failed to export Excel' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
