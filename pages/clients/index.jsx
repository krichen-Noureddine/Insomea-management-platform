import React, { useState, useEffect } from 'react';
import ClientForm from '../../components/AddClientForm';
import ClientsTable from '@/components/clientstable';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const onEdit = (client) => {
        console.log("Editing client:", client);
    
        setEditingClient(client);
        setShowForm(true); // Show the form when editing is initiated


    };
    const resetFormMode = () => {
        setEditingClient(null);
        setShowForm(false);
    };
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);
    const handleUpdate = async (formData) => {
        console.log("Initiating update with formData:", formData);
    
        try {
            console.log(`Sending PUT request to update client with ID: ${editingClient._id}`);
            const response = await fetch(`http://localhost:3000/api/clients/${editingClient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                console.log(`Update failed with status: ${response.status}`);
                throw new Error('Failed to update client');
            }
    
            const updatedClient = await response.json();
            console.log("Update successful, server response:", updatedClient);
            setClients(currentClients => {
                const updatedClientsList = currentClients.map(client =>
                    client._id === editingClient._id ? { ...client, ...formData, ...updatedClient } : client
                );
                console.log("Updated clients list:", updatedClientsList);
                return updatedClientsList;
            });
    
            setShowForm(false); // Optionally close form after successful update
            setEditingClient(null); // Reset editing client state
            console.log("Client update process completed.");
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };
    
    const handleCreate = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const responseData = await response.json();
                const newClient = {
                    ...formData,
                    _id: responseData.insertedId, // Use insertedId as _id
                };
                
                setClients(currentClients => [...currentClients, newClient]);
            } else {
                console.error('Failed to add client:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };
    
    

    return (
        <div>
           <ClientForm handleSubmit={editingClient ? handleUpdate : handleCreate} initialData={editingClient} showForm={showForm} 
                setShowForm={setShowForm} resetFormMode={resetFormMode} />

            {isLoading ? (
                <p>Loading clients...</p>
            ) : (
                <ClientsTable clients={clients} setClients={setClients} onEdit={onEdit}  />
            )}
        </div>
    );
};

export default ClientsPage;
