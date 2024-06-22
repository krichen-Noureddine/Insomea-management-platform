import React, { useState, useEffect } from 'react';
import styles from '../../styles/AzureSub.module.css';
import AzureForm from '../../components/AzureSubForm';
import ProviderForm from '@/components/ProviderForm';
import AzureSubscriptionsTable from '@/components/subscriptionsList';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the loading spinner

export default function AzureSubscriptionPage() {
    const [activeComponent, setActiveComponent] = useState('azureForm');
    const [subscriptions, setSubscriptions] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchClientsAndCredentials();
    }, []);

    const fetchClientsAndCredentials = async () => {
        try {
            setIsLoading(true); // Set loading to true before starting fetch
            const credentialsResponse = await fetch('http://localhost:3000/api/credentials');
            if (!credentialsResponse.ok) {
                throw new Error('Failed to fetch credentials');
            }
            const credentialsData = await credentialsResponse.json();

            const clientsResponse = await fetch('http://localhost:3000/api/clients');
            if (!clientsResponse.ok) {
                throw new Error('Failed to fetch clients');
            }
            const clientsData = await clientsResponse.json();

            const mergedData = credentialsData.map(credential => {
                const clientInfo = clientsData.find(client => client._id === credential.clientId);
                return {
                    ...credential,
                    companyName: clientInfo ? clientInfo.companyName : 'Unknown',
                };
            });

            setClients(mergedData);
            setIsLoading(false); // Set loading to false after fetch completes
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); // Set loading to false if there is an error
        }
    };

    const fetchSubscriptions = async (clientId) => {
        try {
            if (!clientId) {
                console.error('No clientId provided to fetch subscriptions.');
                return;
            }

            const response = await fetch(`http://localhost:3000/api/subscriptions?clientId=${clientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Azure subscriptions');
            }
            const data = await response.json();

            setSubscriptions(prevSubscriptions => {
                const updatedSubscriptions = [
                    ...prevSubscriptions.filter(sub => sub.clientId !== clientId),
                    ...data.value
                ];
                return updatedSubscriptions;
            });
        } catch (error) {
            console.error(`Error fetching subscriptions for client ID: ${clientId}:`, error);
        }
    };

    const handleComponentSwitch = (componentName) => {
        setActiveComponent(componentName);
    };

    if (isLoading) {
        return <LoadingSpinner />; // Show loading spinner if data is loading
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonBar}>
                <button
                    className={`${styles.button} ${activeComponent === 'azureForm' && styles.active}`}
                    onClick={() => handleComponentSwitch('azureForm')}
                >
                    New Subscription
                </button>
                <button
                    className={`${styles.button} ${activeComponent === 'anotherForm' && styles.active}`}
                    onClick={() => handleComponentSwitch('anotherForm')}
                >
                    Import Azure Subscriptions
                </button>
                <button
                    className={`${styles.button} ${activeComponent === 'Provider' && styles.active}`}
                    onClick={() => handleComponentSwitch('Provider')}
                >
                    Providers
                </button>
            </div>
            <div>
                {activeComponent === 'azureForm' && <AzureForm />}
                {activeComponent === 'anotherForm' && (
                    <AzureSubscriptionsTable
                        clients={clients}
                        subscriptions={subscriptions}
                        fetchSubscriptions={fetchSubscriptions}
                    />
                )}
                {activeComponent === 'Provider' && <ProviderForm />}
            </div>
        </div>
    );
}
