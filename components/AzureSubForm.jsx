import React, { useState, useEffect } from 'react';
import styles from '../styles/form.module.css';

function AzureForm() {
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        subscriptionName: '',
        serviceType: 'Azure',
        subscriptionStartDate: '',
        Provider: '',
        costEstimate: '',
        resources: '',
        resellerId: '',
        azureOffer: '',
        purchaseOrderNumber: '',
        status: 'Active',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [clients, setClients] = useState([]);
    const [resellers, setResellers] = useState([]);
    const [azureOffers, setAzureOffers] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/clients');
                if (!response.ok) throw new Error('Failed to fetch clients');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/azure/provider');
                if (!response.ok) throw new Error('Failed to fetch providers');
                const data = await response.json();
                setResellers(data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };
    
        fetchProviders();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const preparedData = {
            ...formData,
            resources: formData.resources ? formData.resources.split(',') : [],
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/azure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });
    
            console.log('Response:', response);
    
            if (!response.ok) {
                let errorMessage = 'Network response was not ok';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (error) {
                    // If parsing fails, keep the default error message
                }
                throw new Error(errorMessage);
            }
    
            console.log('Subscription added successfully');
    
            // Clear the form after successful submission
            setFormData({
                clientId: '',
                clientName: '',
                subscriptionName: '',
                serviceType: 'Azure',
                subscriptionStartDate: '',
                Provider: '',
                costEstimate: '',
                resources: '',
                resellerId: '',
                azureOffer: '',
                purchaseOrderNumber: '',
                
            });
        } catch (error) {
            console.error('Failed to add subscription:', error);
        }
    };
    
    

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="clientName">Client Name</label>
                    <select
    id="clientName"
    name="clientName"
    value={formData.clientName}
    onChange={handleChange}
    required
>
    <option value="" key="defaultClient">Select a Client</option>
    {clients.map(client => (
        <option key={client.id} value={client.companyName}>{client.companyName}</option>
    ))}
</select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="subscriptionName">Subscription Name</label>
                    <input type="text" id="subscriptionName" name="subscriptionName" value={formData.subscriptionName} onChange={handleChange} required />
                </div>

               

                <div className={styles.formGroup}>
                    <label htmlFor="subscriptionStartDate">Start Date</label>
                    <input type="date" id="subscriptionStartDate" name="subscriptionStartDate" value={formData.subscriptionStartDate} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
    <label htmlFor="resellerId">Provider</label>
    <select
        id="resellerId"
        name="resellerId"
        value={formData.resellerId}
        onChange={handleChange}
        required
    >
        <option value="" key="defaultReseller">Select a Provider</option>
        {resellers.map(reseller => (
            <option key={reseller.id} value={reseller.id}>{reseller.name}</option>
        ))}
    </select>
</div>

               
                <div className={styles.formGroup}>
    <label htmlFor="azureOffer">Azure Offer</label>
    <select
    id="azureOffer"
    name="azureOffer"
    value={formData.azureOffer}
    onChange={handleChange}
    required
>
    <option value="" key="defaultOption">Select an Azure Offer</option>
    <option value="payAsYouGo" key="payAsYouGo">Pay As You Go</option>
    <option value="enterpriseAgreement" key="enterpriseAgreement">Enterprise Agreement</option>
    <option value="subscriptionPlan" key="subscriptionPlan">Subscription Plan</option>
    <option value="freeTier" key="freeTier">Free Tier</option>
    {/* Add more types of offers below if needed */}
</select>

</div>

                
                <div className={styles.formGroup}>
                    <label htmlFor="purchaseOrderNumber">Purchase Order Number</label>
                    <input
                        type="text"
                        id="purchaseOrderNumber"
                        name="purchaseOrderNumber"
                        value={formData.purchaseOrderNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="serviceType">Service Type</label>
                    <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} required>
                        <option value="Azure">Azure</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select 
                        id="status" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="Active" style={{ color: 'green' }}>Active</option>
                        <option value="Suspended" style={{ color: 'orange' }}>Suspended</option>
                        <option value="Closed" style={{ color: 'red' }}>Closed</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>Add Subscription</button>
            </form>
        </div>
    );
}

export default AzureForm;
