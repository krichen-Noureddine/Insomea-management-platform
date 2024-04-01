import React, { useState, useEffect } from 'react';
import styles from '../styles/form.module.css'; // Import CSS module file for styling
import { DeleteConfirmationPopup } from './DeleteConfirmationPopup';
import { useRouter } from 'next/router';


const ClientsTable = ({ clients, setClients ,onEdit}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [clientIdToDelete, setClientIdToDelete] = useState(null);
    const filteredClients = clients.filter(client =>
        (client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    useEffect(() => {
        console.log("ClientsTable clients prop:", clients);
    }, [clients]);
    
    useEffect(() => {
        setIsLoading(false); // No need to fetch data here since it's passed as a prop
    }, []);
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
                // Server responded with an error status
                console.error(`Failed to delete client with ID: ${clientIdToDelete}. Status: ${response.statusText}`);
            }
        } catch (error) {
            // An error occurred during fetch
            console.error(`Error occurred while deleting client with ID: ${clientIdToDelete}.`, error);
        } finally {
            // This block will run regardless of the try/catch outcome
            console.log(`Deletion process completed for client with ID: ${clientIdToDelete}.`);
            setShowDeletePopup(false);
            setClientIdToDelete(null); // Reset for future deletions
        }
    };
    
    
    

    if (isLoading) return <p>Loading clients...</p>;
    if (!clients.length) return <p>No clients found.</p>;

    return (
        <div className={styles.container}>
            {/* Step 2: Search input */}
            <div className={styles.searchAndFilterBar}>
    <input
        type="text"
        placeholder="Search..."
        className={styles.searchInput}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    {/* Example Filter Dropdown */}
    <select className={styles.filterSelect} >
        <option value="">Filter by...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        {/* More options as per your data */}
    </select>
    {/* PDF Export Button */}
    <button className={styles.pdfExportButton} >
        Export 
    </button>
</div>

            <div className={styles.tableWrapper}>
            <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={() => {
            handleDelete(); // Now it uses the state clientIdToDelete for deletion
        }}
    />
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Contact Name</th>
                            <th>Contact Email</th>
                            <th>Contact Phone</th>
                            <th>Location</th>
                            <th>Adresse</th>
                           

                            <th>Azure Tenant ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Step 3: Mapping filtered clients */}
                        {filteredClients.map((client) => (
                        <tr 
                        key={client._id} 
                        onClick={() => router.push(`/clients/${client._id}`)}
                        style={{ cursor: 'pointer' }} // Optional: Changes the cursor to indicate clickable
                      >
      

                                <td>{client.companyName}</td>
                                <td>{client.contactName}</td>
                                <td>{client.contactEmail}</td>
                                <td>{client.contactPhone}</td>
                                <td>{client.clientLocation}</td>
                                <td>{client.clientAdresse}</td>
                                <td>{client.azureTenantId}</td>
                                <td className={styles.buttons}>
                                <button
                className={styles.button}
                onClick={(e) => {
                    e.stopPropagation(); // Prevents row click event
                    onEdit(client);
                }}
                style={{ marginRight: '10px' }}
            >
                🖊 Edit
            </button>
            <button
                className={styles.button}
                onClick={(e) => {
                    e.stopPropagation(); // Prevents row click event
                    promptDelete(client._id);
                }}
            >
                🗑 Delete
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
