import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmailListItem from '@/components/EmailListItem';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const Settings = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');

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

  const validateEmail = (email) => {
    // Regex for basic email validation
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAddEmail = async () => {
    if (!newEmail) {
      setError('Email address cannot be empty');
      return;
    }

    if (!validateEmail(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(''); // Reset error message

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

      // Ensure the returned data structure is what you expect (email object with _id)
      setEmails(prevEmails => [...prevEmails, data.data]);  // Assuming 'data' contains the new email object

      setNewEmail(''); // Clear the input field after adding the email
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

      // Filter out the deleted email from the list
      setEmails(prevEmails => prevEmails.filter(email => email._id !== id));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleKeyPress = (e) => {
    // Trigger Add Email on Enter key press
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };

  return (
    <div className={styles.container}>
      <TabBar />
      <Card elevation={2} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              label="New Email Address"
              variant="outlined"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyPress} // Handle Enter key press
              error={!!error} // Show error state if there's an error
              helperText={error} // Display the error message
              sx={{ flexGrow: 1 }}
            />
            <Button 
              onClick={handleAddEmail}  
              color="primary" 
              startIcon={<AddIcon />} 
              sx={{ ml: 2 }} // Ensure the button has space between the text field
            >
              Add Email
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {emails.length > 0 ? (
            emails.map((email) => (
              <EmailListItem key={email._id} email={email} onDelete={handleDeleteEmail} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No emails added yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
