import React from 'react';
import {
  Card, CardContent, Typography, Grid, List, ListItem, ListItemText,
  Box, Chip, Accordion, AccordionSummary, AccordionDetails, Avatar, Divider, Paper
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FaRegCheckCircle, FaRegTimesCircle, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import Link from 'next/link';

const Mo365Details = ({ subscription }) => {
  return (
    <Box sx={{ backgroundColor: '#002b5b', padding: 4, borderRadius: 2, color: '#ffffff', marginTop: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Subscription Detail
      </Typography>
      <Paper sx={{ backgroundColor: '#ffffff', color: '#002b5b', borderRadius: 2, boxShadow: 3, padding: 3 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">
              {subscription.accountName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              label={subscription.status}
              color={subscription.status === 'Enabled' ? 'success' : 'error'}
              variant="outlined"
              sx={{ textTransform: 'uppercase' }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><FaInfoCircle /> Account Details</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Account ID" secondary={subscription.accountId || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Applies To" secondary={subscription.appliesTo || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Consumed Units" secondary={subscription.consumedUnits || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="SKU Part Number" secondary={subscription.skuPartNumber} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Total Licenses" secondary={subscription.totalLicenses} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Owner Tenant ID" secondary={subscription.ownerTenantId || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Owner ID" secondary={subscription.ownerId || 'N/A'} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><FaCalendarAlt /> Key Dates</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Created Date" secondary={new Date(subscription.createdDateTime).toLocaleDateString()} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Next Lifecycle Date" secondary={subscription.nextLifecycleDateTime ? new Date(subscription.nextLifecycleDateTime).toLocaleDateString() : 'N/A'} />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Service Plans</Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Service Plans</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {subscription.servicePlans.map(plan => (
                    <ListItem key={plan.servicePlanId} sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemText
                        primary={plan.servicePlanName}
                        secondary={plan.provisioningStatus}
                      />
                      {plan.provisioningStatus === 'Success' ? (
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <FaRegCheckCircle />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          <FaRegTimesCircle />
                        </Avatar>
                      )}
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 3 }}>
          <Link href="/mo365" passHref>
            <Chip label="Back to Subscriptions" color="primary" clickable component="a" />
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Mo365Details;
