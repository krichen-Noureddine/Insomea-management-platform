// pages/clients/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ClientWidget from '../../components/ClientDashboard/ClientCard';
import styles from '../../styles/singleClient.module.css';
import { BillingHistory } from '@/components/ClientDashboard/BillingHistory';
import { SubscriptionDetails } from '@/components/ClientDashboard/Subscription Details';
import AzureBillingDateWidget from '@/components/ClientDashboard/AzureBillingData';
import OfficeBillingDateWidget from '@/components/ClientDashboard/OfficeBillingData';
import LineChart from '@/components/ClientDashboard/LineChart';
import ActiveSubscriptions from '@/components/ClientDashboard/activeSubNumber';
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
    <div className={styles.widget}>
        <ClientWidget
            client={client}
            onEditClick={(client) => {/* Logic for editing */}}
            onDetailsClick={(client) => {/* Logic for showing more details */}}
        />
    </div>
    
    <div className={styles.widget}>
        <AzureBillingDateWidget />
    </div>
    <div >
        <OfficeBillingDateWidget />
    </div>
    <div  classNmea style={{ width: '70%', height: '100%' }}>
            <LineChart />
        </div>
        <div >
        <ActiveSubscriptions />
    </div>
</div>
);
};

export default ClientDetail;