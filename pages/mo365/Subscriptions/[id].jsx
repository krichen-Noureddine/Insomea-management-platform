// pages/mo365/subscriptions/[id].jsx
import React from 'react';
import Mo365Details from '@/components/mo365Details';

const SubscriptionDetailPage = ({ subscription, error }) => {
    if (error) {
        return <div>Error: {error}</div>;
    }

    return subscription ? <Mo365Details subscription={subscription} /> : <div>No subscription found</div>;
};

export async function getServerSideProps({ params }) {
    const { id } = params;

    try {
        const response = await fetch(`http://localhost:3000/api/mo365/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch subscription details');
        }
        const data = await response.json();
console.log(data);
        return {
            props: {
                subscription: data,
            },
        };
    } catch (error) {
        return {
            props: {
                subscription: null,
                error: error.message,
            },
        };
    }
}

export default SubscriptionDetailPage;
