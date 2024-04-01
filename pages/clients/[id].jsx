// pages/clients/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ClientCard from '../../components/ClientCard';
import styles from '../../styles/singleClient.module.css';

const ClientDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchClient = async () => {
        if (!id) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/clients/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }
          const data = await res.json();
          setClient(data);
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchClient();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!client) return <p>No client found</p>;

    return (
        <div className={styles.container}>
          
            <ClientCard client={client}   onEditClick={(client) => { /* Logique pour l'édition */ }} 
  onDetailsClick={(client) => { /* Logique pour afficher plus de détails */ }}  />
            {/* Add more functionalities like update or delete here */}
        </div>
    );
};

export default ClientDetail;
