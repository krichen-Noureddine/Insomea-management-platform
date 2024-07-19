// components/History.jsx

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const History = ({ subscriptions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Resource Location</TableCell>
            <TableCell>Subscription Name</TableCell>
            <TableCell align="right">Cost (USD)</TableCell>
            <TableCell align="right">Usage</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription._id}>
              <TableCell>{subscription.service}</TableCell>
              <TableCell>{subscription.category}</TableCell>
              <TableCell>{subscription.resourceLocation}</TableCell>
              <TableCell>{subscription.subscriptionName}</TableCell>
              <TableCell align="right">{subscription.cost.toFixed(2)}</TableCell>
              <TableCell align="right">{subscription.usage.toFixed(2)}</TableCell>
              <TableCell align="right">{new Date(subscription.from).toLocaleDateString()}</TableCell>
              <TableCell align="right">{new Date(subscription.to).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default History;
