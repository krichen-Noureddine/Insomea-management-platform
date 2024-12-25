import React from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const AdditionalDetails = () => {
  const client = {
    companyName: "insomea computer solutions",
    createdClientDateTime: 1733788800000,
    businessPhones: ["+216 98 174 454 "],
    countryLetterCode: "TN",
    postalCode: "1053",
    clientLocation: "Tunisie",
    clientAddress: "Immeuble Lac D’or, Bloc B, 3ème étage, appartement B31-B32, Rue Île de Faïlaka, Les Berges du Lac II, 1053 Tunis – Tunisie",
    organizationType: "SMB",
    technicalNotificationMails: ["youssef.elhaj@insomea.com"],
    domains: [""]
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>{client?.companyName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created DateTime</TableCell>
                <TableCell>{new Date(client?.createdClientDateTime).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Business Phones</TableCell>
                <TableCell>{client?.businessPhones.join(", ")}</TableCell>
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
                <TableCell>{client?.clientLocation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>{client?.clientAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tenant Type</TableCell>
                <TableCell>{client?.organizationType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Notification Mails</TableCell>
                <TableCell>{client?.technicalNotificationMails.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Domains</TableCell>
                <TableCell>{client?.domains.join(", ")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AdditionalDetails;
