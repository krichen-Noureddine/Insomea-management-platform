import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const AdditionalDetails = ({ client }) => {
  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>{client?.displayName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>{client?.city}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>{client?.street}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Domains</TableCell>
                <TableCell>{client?.verifiedDomains?.join(', ')}</TableCell>
              </TableRow>
              {/* Add more fields as necessary */}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AdditionalDetails;
