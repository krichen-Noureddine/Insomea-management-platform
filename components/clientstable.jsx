import React, { useState, useEffect } from 'react';
import styles from '@/styles/form.module.css'; // Import CSS module file for styling
import { DeleteConfirmationPopup } from './DeleteConfirmationPopup';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ClientsTable = ({ clients, setClients, onEdit }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [groupByOption, setGroupByOption] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order: ascending

  // Function to sort clients based on the selected field and order
  const sortClients = (clients, field, order) => {
    return clients.sort((a, b) => {
      const valueA = a[field]?.toLowerCase() || '';
      const valueB = b[field]?.toLowerCase() || '';
      if (order === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  };

  // Function to group clients by address or alphabetically
  const groupClients = (clients, option) => {
    switch (option) {
      case 'address':
        return clients.sort((a, b) => (a.clientLocation || '').localeCompare(b.clientLocation || ''));
      case 'alphabetical':
        return sortClients(clients, 'companyName', sortOrder);
      default:
        return clients;
    }
  };

  const filteredClients = clients.filter(client =>
    (client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    setIsLoading(false); // No need to fetch data here since it's passed as a prop
  }, [clients]);

  const handleGroupByChange = (e) => {
    setGroupByOption(e.target.value);
  };

  const promptDelete = (clientId) => {
    setShowDeletePopup(true);
    setClientIdToDelete(clientId);
  };

  const handleDelete = async () => {
    if (!clientIdToDelete) {
      console.log('No client ID provided for deletion.');
      return; // Early exit if no clientIdToDelete is provided
    }

    console.log(`Attempting to delete client with ID: ${clientIdToDelete}`);
    const url = `http://localhost:3000/api/clients/${clientIdToDelete}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        // Successfully deleted on the server, now update client-side state
        setClients(currentClients => {
          const updatedClients = currentClients.filter(client => client._id !== clientIdToDelete);
          console.log(`Client with ID: ${clientIdToDelete} deleted successfully. Remaining clients:`, updatedClients);
          return updatedClients;
        });
      } else {
        console.error(`Failed to delete client with ID: ${clientIdToDelete}. Status: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error occurred while deleting client with ID: ${clientIdToDelete}.`, error);
    } finally {
      console.log(`Deletion process completed for client with ID: ${clientIdToDelete}.`);
      setShowDeletePopup(false);
      setClientIdToDelete(null); // Reset for future deletions
    }
  };

  if (isLoading) return <p>Loading clients...</p>;
  if (!clients.length) return <p>No clients found.</p>;

  const groupedAndSortedClients = groupClients(filteredClients, groupByOption);

  return (
    <div className={styles.container}>
      <div className={styles.searchAndFilterBar}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className={styles.filterSelect} value={groupByOption} onChange={handleGroupByChange}>
          <option value="">Group By...</option>
          <option value="address">Address</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <DeleteConfirmationPopup
          isOpen={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleDelete}
        />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Name</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedAndSortedClients.map((client) => (
              <tr
                key={client._id}
                onClick={() => router.push(`/clients/${client._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{client.companyName}</td>
                <td>{client.contactName}</td>
                <td>{client.contactEmail}</td>
                <td>{client.contactPhone}</td>
                <td>{client.clientLocation}</td>
                <td className={styles.buttons}>
                  <button
                    className={styles.button}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(client);
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={(e) => {
                      e.stopPropagation();
                      promptDelete(client._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
