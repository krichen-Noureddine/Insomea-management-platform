import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Button, Box, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClientDetails = ({ client, onEditClick, onDetailsClick }) => {
  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 5, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            {client.companyName.charAt(0)}
          </Avatar>
          <Typography variant="h5" component="div">
            {client.companyName}
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">Contact Name</TableCell>
                <TableCell>{client.contactName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Email</TableCell>
                <TableCell>{client.contactEmail}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Phone</TableCell>
                <TableCell>{client.contactPhone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Location</TableCell>
                <TableCell>{client.clientLocation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Address</TableCell>
                <TableCell>{client.clientAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Azure Tenant ID</TableCell>
                <TableCell>{client.azureTenantId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Organization Type</TableCell>
                <TableCell>{client.organizationType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Status</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />} 
            onClick={() => onEditClick(client)}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<VisibilityIcon />} 
            onClick={() => onDetailsClick(client)}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientDetails;
