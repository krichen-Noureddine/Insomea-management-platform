import React from 'react';
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
                <TableCell>Created DateTime</TableCell>
                <TableCell>{client?.createdDateTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Business Phones</TableCell>
                <TableCell>{client?.businessPhones}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Country Letter Code</TableCell>
                <TableCell>{client?.countryLetterCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Postal Code</TableCell>
                <TableCell>{client?.postalCode}</TableCell>
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
                <TableCell>Tenant Type</TableCell>
                <TableCell>{client?.tenantType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Notification Mails</TableCell>
                <TableCell>{client?.technicalNotificationMails}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Domains</TableCell>
                <TableCell>
                  {client?.verifiedDomains.map((domain, index) => (
                    <span key={index}>
                      {domain.name}
                      {index !== client.verifiedDomains.length - 1 && ', '}
                    </span>
                  ))}
                </TableCell>
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
