import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AlertList from '@/components/AlertList';
import AlertModal from '@/components/AlertModal';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const AlertsPage = () => {
  const [clients, setClients] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [managerEmails, setManagerEmails] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({ type: '', description: '', date: '', client: '', category: 'MO365' });
  const [loading, setLoading] = useState(false);

  // Fetch clients, licenses, and manager emails
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/mo365');
      const data = await response.json();
      setLicenses(data);
    } catch (error) {
      console.error('Failed to fetch licenses', error);
    }
  };

  const fetchManagerEmails = async () => {
    try {
      const response = await fetch('/api/reminder/emails');
      const data = await response.json();
      setManagerEmails(data.map((item) => item.address));
    } catch (error) {
      console.error('Failed to fetch manager emails', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchLicenses();
    fetchManagerEmails();
  }, []);

  useEffect(() => {
    const generateAlerts = () => {
      const generatedAlerts = licenses
        .map((license) => {
          const client = clients.find((client) => client._id === license.clientId);
          if (license.nextLifecycleDateTime) {
            const expirationDate = new Date(license.nextLifecycleDateTime);
            if (expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
              return {
                id: license._id,
                client: client ? client.companyName : license.clientName,
                type: 'License Expiration',
                description: `The license ${license.skuPartNumber} for client ${client ? client.companyName : license.clientName} will expire on ${expirationDate.toLocaleDateString()}.`,
                date: new Date().toISOString(),
                category: 'MO365',
              };
            }
          }
          return null;
        })
        .filter(Boolean); // Removes null values
      setAlerts(generatedAlerts);
    };

    generateAlerts();
  }, [clients, licenses]);

  const handleResend = async (alertData) => {
    setLoading(true);
    try {
      if (!managerEmails.length) throw new Error('No manager emails available.');
      
      for (const email of managerEmails) {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `License Expiration Reminder: ${alertData.type}`,
            text: alertData.description,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          window.alert(`Email sent successfully to: ${email} with ID: ${result.messageId}`);
        } else {
          window.alert(`Failed to send email to ${email}: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      window.alert('Error sending email');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    setNewAlert({ type: '', description: '', date: '', client: '', category: 'MO365' });
    handleClose();
    
    if (managerEmails.length) {
      await handleResend(updatedAlerts[updatedAlerts.length - 1]);
    }
  };

  return (
    <div>
      <TabBar />
      <div className={styles.container}>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

          <input
            type="text"
            className={`${styles.searchInput} ${styles.formControl}`}
            placeholder="Search by Client"
          />
         
          
        </Box>
        <Box>
          <AlertList alerts={alerts} onResend={handleResend} loading={loading} />
        </Box>
        <AlertModal
          open={open}
          handleClose={() => setOpen(false)}
          clients={clients}
          newAlert={newAlert}
          setNewAlert={setNewAlert}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default AlertsPage;
