import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmailListItem from '@/components/EmailListItem';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const Settings = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/reminder/emails');
      if (!res.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await res.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleAddEmail = async () => {
    try {
      const res = await fetch('/api/reminder/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: newEmail }),
      });
      if (!res.ok) {
        throw new Error('Failed to add email');
      }
      const data = await res.json();
      setEmails([...emails, data]);
      setNewEmail('');
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      const res = await fetch(`/api/reminder/emails/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete email');
      }
      setEmails(emails.filter(email => email._id !== id));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className={styles.container}>
      <TabBar />
      <Card elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <CardContent>
      
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              label="New Email Address"
              variant="outlined"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button onClick={handleAddEmail} variant="contained" color="primary" startIcon={<AddIcon />}>
              Add Email
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {emails.map(email => (
            <EmailListItem key={email._id} email={email} onDelete={handleDeleteEmail} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
