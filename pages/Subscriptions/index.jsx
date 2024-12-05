import React, { useState, useEffect } from 'react';
import styles from '../../styles/AzureSub.module.css';
import ProviderForm from '@/components/ProviderForm';
import AzureSubscriptionsTable from '@/components/subscriptionsList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNotification } from '@/components/Notification';
export default function AzureSubscriptionPage() {
    const [activeComponent, setActiveComponent] = useState('anotherForm');
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotification();  // Destructure addNotification from useNotification

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/azure');
            if (!response.ok) throw new Error('Failed to fetch subscriptions');
            const subscriptionsData = await response.json();
            if (!Array.isArray(subscriptionsData)) throw new Error('Unexpected response structure');

            const clientDetailsPromises = subscriptionsData.map(async (subscription) => {
                const clientResponse = await fetch(`http://localhost:3000/api/clients/${subscription.clientId}`);
                if (!clientResponse.ok) throw new Error(`Failed to fetch client with ID: ${subscription.clientId}`);
                const clientData = await clientResponse.json();
                return { ...subscription, companyName: clientData.companyName };
            });

            const subscriptionsWithClientDetails = await Promise.all(clientDetailsPromises);
            setSubscriptions(subscriptionsWithClientDetails);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            addNotification({ type: 'error', message: 'Failed to fetch subscriptions.' });  // Show notification on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsLoading(true);
    
        try {
            const clientsResponse = await fetch('/api/clients');
            if (!clientsResponse.ok) throw new Error('Failed to fetch clients');
            const clientsData = await clientsResponse.json();
            const clientIds = clientsData.map(client => client._id);
    
            const subscriptionPromises = clientIds.map(async (clientId) => {
                try {
                    const response = await fetch(`/api/subscriptions?clientId=${clientId}`);
                    if (!response.ok) throw new Error(`Failed to fetch subscriptions for client ID: ${clientId}`);
                    const data = await response.json();
                    return data.value.map(sub => ({ ...sub, clientId }));
                } catch (error) {
                    console.error(`Error fetching subscriptions for client ID: ${clientId}`, error);
                    
                    // Fetch client details to get the company name for notification
                    let companyName = 'Unknown Company';
                    try {
                        const clientResponse = await fetch(`http://localhost:3000/api/clients/${clientId}`);
                        if (clientResponse.ok) {
                            const clientData = await clientResponse.json();
                            companyName = clientData.companyName;
                        }
                    } catch (fetchError) {
                        console.error(`Failed to fetch company name for client ID: ${clientId}`, fetchError);
                    }
    
                    // Show notification with company name and client ID
                    addNotification(
                        'Error',
                        `Failed to fetch subscriptions for ${companyName} (Client ID: ${clientId})`,
                        'error'
                    );
    
                    return null;
                }
            });
    
            const allSubscriptions = await Promise.all(subscriptionPromises);
    
            const updatedSubscriptions = subscriptions.map(subscription => {
                const updatedSubscriptionArray = allSubscriptions.find(subArray =>
                    subArray && subArray.some(sub => sub.subscriptionId === subscription.subscriptionId)
                );
    
                if (updatedSubscriptionArray) {
                    const updatedSubscription = updatedSubscriptionArray.find(sub => sub.subscriptionId === subscription.subscriptionId);
                    return updatedSubscription ? { ...updatedSubscription, updatedAt: new Date().toISOString() } : subscription;
                }
    
                return subscription;
            });
    
            const subscriptionsWithClientDetails = await Promise.all(updatedSubscriptions.map(async (subscription) => {
                const clientResponse = await fetch(`http://localhost:3000/api/clients/${subscription.clientId}`);
                if (!clientResponse.ok) throw new Error(`Failed to fetch client with ID: ${subscription.clientId}`);
                const clientData = await clientResponse.json();
                return { ...subscription, companyName: clientData.companyName };
            }));
    
            setSubscriptions(subscriptionsWithClientDetails);
        } catch (error) {
            const errorMessage = error.message || JSON.stringify(error); // Ensure error message is a string
            addNotification('Error', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleComponentSwitch = (componentName) => {
        setActiveComponent(componentName);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonBar}>
                <button
                    className={`${styles.button} ${activeComponent === 'anotherForm' && styles.active}`}
                    onClick={() => handleComponentSwitch('anotherForm')}
                >
                    Azure Subscriptions
                </button>
                <button
                    className={`${styles.button} ${activeComponent === 'Provider' && styles.active}`}
                    onClick={() => handleComponentSwitch('Provider')}
                >
                    Providers
                </button>
            </div>
    
            <div>
                {activeComponent === 'anotherForm' && (
                    <AzureSubscriptionsTable subscriptions={subscriptions} handleRefresh={handleRefresh} />
                )}
                {activeComponent === 'Provider' && <ProviderForm />}
            </div>
        </div>
    );
}
