import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AlertList from '@/components/AlertList';
import AlertModal from '@/components/AlertModal';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const AlertsPage = () => {
  const [clients, setClients] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({ type: '', description: '', date: '', client: '', category: 'MO365' });

  // Fetch clients data
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  // Fetch licenses data
  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/mo365');
      const data = await response.json();
      setLicenses(data);
    } catch (error) {
      console.error('Failed to fetch licenses', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchLicenses();
  }, []);

  // Generate alerts based on specific conditions
  useEffect(() => {
    const generatedAlerts = [];

    licenses.forEach((license) => {
      const client = clients.find((client) => client._id === license.clientId);

      // Check for suspended licenses
      if (license.status === 'Suspended') {
        generatedAlerts.push({
          id: license.id,
          client: client ? client.companyName : 'Unknown Client',
          type: 'License Suspended',
          description: `The license ${license.skuPartNumber} for client ${client ? client.companyName : 'Unknown'} is suspended.`,
          date: new Date().toISOString(),
          category: 'MO365',
        });
      }

      // Check for upcoming expiration dates
      if (license.nextLifecycleDateTime && new Date(license.nextLifecycleDateTime) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
        generatedAlerts.push({
          id: license.id,
          client: client ? client.companyName : 'Unknown Client',
          type: 'License Expiration',
          description: `The license ${license.skuPartNumber} for client ${client ? client.companyName : 'Unknown'} will expire on ${new Date(license.nextLifecycleDateTime).toLocaleDateString()}.`,
          date: new Date().toISOString(),
          category: 'MO365',
        });
      }
    });

    setAlerts(generatedAlerts);
  }, [clients, licenses]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    setNewAlert({ type: '', description: '', date: '', client: '', category: 'MO365' });
    handleClose();
  };

  return (
    <div>
      <TabBar /> {/* Include the TabBar component */}
      <div className={styles.container}>     
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            label="Search Alerts"
            variant="outlined"
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
            }}
          />
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Alert
          </Button>
        </Box>
        <Box>
          <Typography variant="h6">MO365 Alerts</Typography>
          <AlertList alerts={alerts} />
        </Box>
        <AlertModal
          open={open}
          handleClose={handleClose}
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
