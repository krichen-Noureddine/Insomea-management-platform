import React, { useState } from 'react';
import styles from '../../styles/AzureSub.module.css';
import AzureForm from '../../components/AzureSubForm';
import ProviderForm from '@/components/ProviderForm';

export default function AzureSubscriptionPage() {
    const [activeComponent, setActiveComponent] = useState('azureForm');

    const handleComponentSwitch = (componentName) => {
        setActiveComponent(componentName);
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonBar}>
                <button
                    className={`${styles.button} ${activeComponent === 'azureForm' && styles.active}`}
                    onClick={() => handleComponentSwitch('azureForm')}
                >
                    New Sub
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
                {activeComponent === 'anotherForm' && <div>Another Form Component</div>}
                {activeComponent === 'Provider' && <ProviderForm />}
            </div>
        </div>
    );
}
