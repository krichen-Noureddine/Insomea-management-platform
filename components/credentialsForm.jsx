import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/form.module.css';
import { useNotification } from './Notification';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ClientCredentialsSetup = ({ onNewCredential }) => {
    const { addNotification } = useNotification();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [loading, setLoading] = useState(false);
    const [expirationType, setExpirationType] = useState('6 months');
    const [customExpirationDate, setCustomExpirationDate] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsData = await fetch('/api/clients');
                const clients = await clientsData.json();
                setClients(clients);
            } catch (error) {
                console.error('Error fetching clients:', error);
                addNotification('Error', 'Error fetching clients', 'error');
            }
        };

        fetchClients();
    }, [addNotification]);

    const handleClientSelect = (event) => {
        setSelectedClient(event.target.value);
        reset();
    };

    const handleExpirationTypeChange = (event) => {
        setExpirationType(event.target.value);
    };

    const calculateExpirationDate = (type) => {
        const today = new Date();
        switch (type) {
            case '6 months':
                return new Date(today.setMonth(today.getMonth() + 6));
            case '12 months':
                return new Date(today.setMonth(today.getMonth() + 12));
            case '24 months':
                return new Date(today.setMonth(today.getMonth() + 24));
            case 'custom':
                return customExpirationDate;
            default:
                return null;
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const selectedClientDetails = clients.find(client => client._id === selectedClient);
            const expirationDate = calculateExpirationDate(expirationType);

            if (!expirationDate) {
                addNotification('Error', 'Invalid expiration date', 'error');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId: selectedClientDetails._id, ...data, expirationDate }),
            });
            const responseData = await response.json();
            if (response.ok) {
                console.log('Credentials submitted successfully');
                addNotification('Success', 'Credentials submitted successfully', 'success');
                reset();
                setSelectedClient('');
                setCustomExpirationDate(null);
                onNewCredential(responseData.credentials);
            } else {
                addNotification('Error', `${responseData.error}: ${responseData.description}`, 'error');
            }
        } catch (error) {
            console.error('Error submitting credentials:', error);
            addNotification('Error', error.message || 'Error submitting credentials', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Client Credentials Setup</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <select value={selectedClient} onChange={handleClientSelect} className={styles.select}>
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.companyName}
                        </option>
                    ))}
                </select>
                {selectedClient && (
                    <>
                        <input
                            type="text"
                            name="tenantId"
                            placeholder="Tenant ID"
                            {...register('tenantId', { required: 'Tenant ID is required' })}
                            className={styles.input}
                        />
                        {errors.tenantId && <p className={styles.error}>{errors.tenantId.message}</p>}

                        <input
                            type="text"
                            name="clientSecret"
                            placeholder="Client Secret"
                            {...register('clientSecret', { required: 'Client Secret is required' })}
                            className={styles.input}
                        />
                        {errors.clientSecret && <p className={styles.error}>{errors.clientSecret.message}</p>}

                        <input
                            type="text"
                            name="azureClientId"
                            placeholder="Azure Client ID"
                            {...register('azureClientId', { required: 'Azure Client ID is required' })}
                            className={styles.input}
                        />
                        {errors.azureClientId && <p className={styles.error}>{errors.azureClientId.message}</p>}

                        <select value={expirationType} onChange={handleExpirationTypeChange} className={styles.select}>
                            <option value="6 months">6 Months</option>
                            <option value="12 months">12 Months</option>
                            <option value="24 months">24 Months</option>
                            <option value="custom">Custom</option>
                        </select>
                        {expirationType === 'custom' && (
                            <DatePicker
                                selected={customExpirationDate}
                                onChange={(date) => setCustomExpirationDate(date)}
                                dateFormat="yyyy/MM/dd"
                                className={styles.input}
                                placeholderText="Select Custom Expiration Date"
                            />
                        )}
                        {errors.customExpiration && <p className={styles.error}>{errors.customExpiration.message}</p>}

                        <button type="submit" disabled={loading} className={styles.submitButton}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default ClientCredentialsSetup;
