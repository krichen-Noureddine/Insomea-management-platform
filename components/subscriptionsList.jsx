import React, { useState } from 'react';
import styles from '../styles/AzureList.module.css'; // Import your CSS module
import Accordion from './Accordion';
import LoadingSpinner from './LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const AzureSubscriptionsTable = ({ clients, subscriptions, fetchSubscriptions }) => {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState(clients); // State to hold filtered clients

    const toggleClient = async (clientId) => {
        if (selectedClientId === clientId) {
            setSelectedClientId(null);
        } else {
            setIsLoading(true);
            await fetchSubscriptions(clientId);
            setSelectedClientId(clientId);
            setIsLoading(false);
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        // Filter clients based on companyName containing search term
        const filteredClients = clients.filter(client =>
            client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filteredClients);
    };

    return (
        <div className={styles.container}>
            {/* Search and Filter Bar */}
            <div className={`${styles.tableWrapper} ${styles.searchAndFilterBar}`}>
                {/* Search Input */}
                <input
                    type="text"
                    className={`${styles.searchInput} ${styles.formControl}`}
                    placeholder="Search by Company Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                {/* Filter Select */}
                <select className={`${styles.filterSelect} ${styles.formControl}`}>
                    <option value="">Filter by...</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="type">Type</option>
                </select>
                
                {/* PDF Export Button */}
                <button className={`${styles.pdfExportButton} ${styles.formControl}`}>Export to PDF</button>
            </div>

            {/* Clients Section */}
            <div className={styles.tableWrapper}>
                {filteredClients.map(client => (
                    <div key={client.clientId} className={styles.clientSection}>
                        <div className={styles.clientHeader} onClick={() => toggleClient(client.clientId)}>
                            <div>
                                <h3>Tenant Id: {client.tenantId}</h3>
                                <h3>Company Name: {client.companyName}</h3>
                            </div>
                            <div className={styles.icon}>
                                {selectedClientId === client.clientId ? (
                                    <FontAwesomeIcon icon={faMinusCircle} />
                                ) : (
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                )}
                            </div>
                        </div>
                        {selectedClientId === client.clientId && (
                            isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className={styles.subscriptionsList}>
                                    {subscriptions
                                        .filter(subscription => subscription.clientId === client.clientId)
                                        .map(subscription => (
                                            <Accordion
                                                key={subscription.subscriptionId}
                                                subscription={subscription}
                                                onRefresh={() => fetchSubscriptions(client.clientId)}
                                            />
                                        ))}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AzureSubscriptionsTable;
