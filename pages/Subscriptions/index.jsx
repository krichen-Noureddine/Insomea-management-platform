import React, { useState, useEffect } from 'react';
import styles from '../../styles/AzureSub.module.css';
import ProviderForm from '@/components/ProviderForm';
import AzureSubscriptionsTable from '@/components/subscriptionsList';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AzureSubscriptionPage() {
    const [activeComponent, setActiveComponent] = useState('anotherForm');
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/azure');
            if (!response.ok) {
                throw new Error('Failed to fetch subscriptions');
            }
            const subscriptionsData = await response.json();
            console.log('Subscriptions Data:', subscriptionsData);
    
            if (!Array.isArray(subscriptionsData)) {
                throw new Error('Unexpected response structure');
            }
    
            const clientDetailsPromises = subscriptionsData.map(async (subscription) => {
                const clientResponse = await fetch(`http://localhost:3000/api/clients/${subscription.clientId}`);
                if (!clientResponse.ok) {
                    throw new Error(`Failed to fetch client with ID: ${subscription.clientId}`);
                }
                const clientData = await clientResponse.json();
                console.log('Client Data:', clientData);
                return {
                    ...subscription,
                    companyName: clientData.companyName,
                };
            });
    
            const subscriptionsWithClientDetails = await Promise.all(clientDetailsPromises);
            setSubscriptions(subscriptionsWithClientDetails);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
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
                    <AzureSubscriptionsTable subscriptions={subscriptions} />
                )}
                {activeComponent === 'Provider' && <ProviderForm />}
            </div>
        </div>
    );
}
