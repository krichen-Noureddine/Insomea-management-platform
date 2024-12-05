import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';

const AlertList = ({ alerts, onResend, loading }) => {
  return (
    <Paper sx={{ backgroundColor: '#182237', color: 'white' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white' }}>Client</TableCell>
            <TableCell style={{ color: 'white' }}>Type</TableCell>
            <TableCell style={{ color: 'white' }}>Description</TableCell>
            <TableCell style={{ color: 'white' }}>Date</TableCell>
            <TableCell style={{ color: 'white' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map(alert => (
            <TableRow key={alert.id}>
              <TableCell style={{ color: 'white' }}>{alert.client}</TableCell>
              <TableCell style={{ color: 'white' }}>{alert.type}</TableCell>
              <TableCell style={{ color: 'white' }}>{alert.description}</TableCell>
              <TableCell style={{ color: 'white' }}>{new Date(alert.date).toLocaleDateString()}</TableCell>
              <TableCell style={{ color: 'white' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onResend(alert)}
                  disabled={loading}  // Disable button if loading
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Resend'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AlertList;
