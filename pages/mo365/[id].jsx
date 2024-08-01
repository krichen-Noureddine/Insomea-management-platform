import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Mo365Details from '@/components/mo365Details';

const SubscriptionDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchSubscription = async () => {
                try {
                    const response = await fetch(`/api/mo365/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch subscription details');
                    }
                    const data = await response.json();
                    setSubscription(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchSubscription();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return subscription ? <Mo365Details subscription={subscription} /> : <div>No subscription found</div>;
};

export default SubscriptionDetailPage;
