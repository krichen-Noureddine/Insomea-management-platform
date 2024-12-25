import React, { useState } from 'react';
import styles from '@/styles/form.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CredentialsComponent = ({ credentials, clients, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupByClient, setGroupByClient] = useState('');

  // Filter credentials by search term
  const filteredCredentials = credentials.filter((credential) => {
    const client = clients.find((client) => client._id === credential.clientId);
    const clientName = client ? client.companyName : '';
    return (
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.tenantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.azureClientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group credentials by selected client
  const groupedCredentials =
    groupByClient !== ''
      ? filteredCredentials.filter(
          (credential) => credential.clientId === groupByClient
        )
      : filteredCredentials;

  return (
    <div className={styles.container}>

      {/* Search and Filter */}
      <div className={styles.searchAndFilterBar}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

       
      </div>

      {/* Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Client</th>
            <th>Tenant ID</th>
            <th>Azure Client ID</th>
            <th>Client Secret</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupedCredentials.map((credential) => {
            const client = clients.find((client) => client._id === credential.clientId);
            return (
              <tr key={credential._id}>
                <td>{client ? client.companyName : 'Unknown Client'}</td>
                <td>{credential.tenantId}</td>
                <td>{credential.azureClientId}</td>
                <td>{credential.clientSecret}</td>
                <td>
                  {credential.expirationDate
                    ? new Date(credential.expirationDate).toLocaleDateString()
                    : 'No expiration date'}
                </td>
                <td>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                </td>
                <td>
                  {/* Update Button */}
                  <button
                    className={styles.actionButton}
                    onClick={() => onUpdate(credential)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Update
                  </button>

                  {/* Delete Button */}
                  <button
                    className={styles.actionButton}
                    onClick={() => onDelete(credential._id)}
                    style={{ color: 'red' }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CredentialsComponent;
