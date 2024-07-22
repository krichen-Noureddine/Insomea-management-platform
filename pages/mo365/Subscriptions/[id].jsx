import React from 'react';
import useSWR from 'swr';
import Mo365Details from '@/components/mo365Details';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SubscriptionDetailPage = ({ id }) => {
    const { data: subscription, error } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_API_URL}/api/mo365/${id}` : null,
        fetcher
    );

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return subscription ? <Mo365Details subscription={subscription} /> : <div>Loading...</div>;
};

// `getServerSideProps` is still needed to provide the initial `id` prop
export async function getServerSideProps({ params }) {
    const { id } = params;

    return {
        props: {
            id,
        },
    };
}

export default SubscriptionDetailPage;
