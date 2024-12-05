import React, { useState, useEffect } from 'react';
import ClientForm from '../../components/AddClientForm';
import ClientsTable from '@/components/clientstable';
import NavBar from '@/components/navbar2'; // Ensure this path is correct
import ClientCredentialsSetup from '@/components/credentialsForm';
import CredentialsComponent from '@/components/credentialsTable';
import { useNotification } from '@/components/Notification';
import useAuthentication from '@/utils/auth';
import { TbLock } from "react-icons/tb";
import styles from '@/styles/noAccess.module.css'
const ClientsPage = () => {
    const { addNotification } = useNotification();
    const { isAuthenticated, account, login, logout } = useAuthentication(); // Authentication state

    const [clients, setClients] = useState([]);
    const [credentials, setCredentials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [activeComponent, setActiveComponent] = useState('combinedView'); // Set initial state to combinedView

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/clients');
                if (!response.ok) {
                    throw new Error('Failed to fetch clients');
                }
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error(error);
                addNotification('Failed to fetch clients', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [addNotification]);

    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/credentials');
                if (!response.ok) {
                    throw new Error('Failed to fetch credentials');
                }
                const data = await response.json();
                setCredentials(data);
            } catch (error) {
                console.error(error);
                addNotification('Failed to fetch credentials', 'error');
            }
        };

        fetchCredentials();
    }, [addNotification]);

    const onEdit = (client) => {
        setEditingClient(client);
        setShowForm(true); // Show the form when editing is initiated
        setActiveComponent('combinedView'); // Switch to combined view
    };

    const resetFormMode = () => {
        setEditingClient(null);
        setShowForm(false);
        setActiveComponent('combinedView'); // Switch back to combined view
    };

    const handleUpdate = async (formData) => {
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${editingClient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update client');
            }

            const updatedClient = await response.json();
            setClients((currentClients) =>
                currentClients.map((client) =>
                    client._id === editingClient._id ? { ...client, ...formData, ...updatedClient } : client
                )
            );
                  resetFormMode();
            addNotification('Client updated successfully', 'success');
        } catch (error) {
            console.error('Error updating client:', error);
            addNotification('Failed to update client', 'error');
        }
    };

    const handleCreate = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const responseData = await response.json();
                const newClient = {
                    ...formData,
                    _id: responseData.insertedId, // Use insertedId as _id
                };

                setClients((currentClients) => [...currentClients, newClient]);
                setActiveComponent('combinedView'); // Switch back to combined view after creation
                addNotification('Client created successfully', 'success');
            } else {
                console.error('Failed to add client:', response.statusText);
                addNotification('Failed to add client', 'error');
            }
        } catch (error) {
            console.error('Error creating client:', error);
            addNotification('Error creating client', 'error');
        }
    };

    const handleNewCredential = (newCredential) => {
        setCredentials((currentCredentials) => [...currentCredentials, newCredential]);
    };

    // Deny access if not authenticated
    if (!isAuthenticated) {
        return (
            <div>
                <NavBar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
                <div className={styles.container}>
                    <div style={{ textAlign: 'center' }}>
                        <TbLock style={{ fontSize: '20rem' }} />
                        <p style={{ marginTop: '2px' }}>You do not have permission to view this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            {activeComponent === 'combinedView' && (
                <div>
                    <ClientForm
                        handleSubmit={editingClient ? handleUpdate : handleCreate}
                        initialData={editingClient}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        resetFormMode={resetFormMode}
                    />
                    <div>
                        {isLoading ? (
                            <p>Loading clients...</p>
                        ) : (
                            <ClientsTable clients={clients} setClients={setClients} onEdit={onEdit} />
                        )}
                    </div>
                </div>
            )}
            {activeComponent === 'credentialsSetup' && (
                <div>
                    <ClientCredentialsSetup onNewCredential={handleNewCredential} />
                    <CredentialsComponent credentials={credentials} clients={clients} />
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
