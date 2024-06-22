import React, { useState } from 'react';
import styles from '../styles/AzureList.module.css';
import Accordion from './Accordion';
import LoadingSpinner from './LoadingSpinner'; // Import the loading spinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
const AzureSubscriptionsTable = ({ clients, subscriptions, fetchSubscriptions }) => {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state for this component

    const toggleClient = async (clientId) => {
        if (selectedClientId === clientId) {
            setSelectedClientId(null); // Collapse the accordion if it's already open
        } else {
            setIsLoading(true); // Set loading to true before fetching subscriptions
            await fetchSubscriptions(clientId); // Fetch subscriptions before opening the accordion
            setSelectedClientId(clientId); // Open the accordion
            setIsLoading(false); // Set loading to false after fetch completes
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                {clients.map(client => (
                    <div key={client.clientId} className={styles.clientSection}>
                        <div 
                            className={styles.clientHeader}
                            onClick={() => toggleClient(client.clientId)}
                        >
                            <div>
                                <h3>Tenant Id ID: {client.tenantId}</h3>
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
                                <LoadingSpinner /> // Show loading spinner while fetching subscriptions
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
                                        ))
                                    }
                                </div>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AzureSubscriptionsTable;
