import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const Summary = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filteredAlerts, setFilteredAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    // Apply search and filter to alerts when either changes
    applyFilters();
  }, [searchTerm, selectedFilter, alerts]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const applyFilters = () => {
    let filtered = alerts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((alert) =>
        alert.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected filter option
    if (selectedFilter) {
      filtered = filtered.filter((alert) => alert.status === selectedFilter);
    }

    setFilteredAlerts(filtered);
  };

  return (
    <div className={styles.container}>
      <TabBar />

      {/* Search and Filter Bar */}
      <div className={`${styles.searchAndFilterBar}`}>
        <input
          type="text"
          className={`${styles.searchInput} ${styles.formControl}`}
          placeholder="Search by subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Filter Select */}
        <select
          className={`${styles.filterSelect} ${styles.formControl}`}
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Sent">Sent</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <Card elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sent Alerts Summary
          </Typography>
          <Divider sx={{ my: 2 }} />
          {filteredAlerts.length === 0 ? (
            <Typography>No alerts have been sent yet.</Typography>
          ) : (
            filteredAlerts.map((alert) => (
              <Box key={alert._id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Recipient: {alert.recipientEmail}
                </Typography>
                <Typography variant="body1">Subject: {alert.subject}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {alert.status}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Sent At: {new Date(alert.timestamp).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
