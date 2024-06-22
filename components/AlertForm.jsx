import React from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';

const AlertForm = ({ clients, newAlert, setNewAlert, handleSave }) => {
  return (
    <Box sx={{ bgcolor: '#182237', color: 'white', padding: 3, borderRadius: 2, width: '400px', margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Add New Alert
      </Typography>
      <TextField
        label="Type"
        select
        fullWidth
        value={newAlert.type}
        onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
      >
        <MenuItem value="Critical">Critical</MenuItem>
        <MenuItem value="Warning">Warning</MenuItem>
        <MenuItem value="Informational">Informational</MenuItem>
      </TextField>
      <TextField
        label="Description"
        fullWidth
        value={newAlert.description}
        onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="Date"
        type="date"
        fullWidth
        value={newAlert.date}
        onChange={(e) => setNewAlert({ ...newAlert, date: e.target.value })}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="Client"
        select
        fullWidth
        value={newAlert.client}
        onChange={(e) => setNewAlert({ ...newAlert, client: e.target.value })}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
      >
        {clients.map(client => (
          <MenuItem key={client._id} value={client._id}>
            {client.companyName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Category"
        select
        fullWidth
        value={newAlert.category}
        onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
      >
        <MenuItem value="Azure">Azure</MenuItem>
        <MenuItem value="MO365">MO365</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
        Save Alert
      </Button>
    </Box>
  );
};

export default AlertForm;
