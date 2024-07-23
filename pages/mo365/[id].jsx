// import React from 'react';
// import useSWR from 'swr';
// import Mo365Details from '@/components/mo365Details';

// // Fetcher function for SWR
// const fetcher = (url) => fetch(url).then((res) => res.json());

// const SubscriptionDetailPage = ({ id, initialSubscription }) => {
//     // Use SWR for client-side data fetching
//     const { data: subscription, error } = useSWR(
//         id ? `${process.env.NEXT_PUBLIC_API_URL}/api/mo365/${id}` : null,
//         fetcher,
//         { initialData: initialSubscription }
//     );

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     return subscription ? <Mo365Details subscription={subscription} /> : <div>Loading...</div>;
// };

// export async function getStaticPaths() {
//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mo365`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch subscriptions');
//         }
//         const subscriptions = await response.json();

//         // Generate paths with `id` as a string
//         const paths = subscriptions.map((subscription) => ({
//             params: { id: subscription.id.toString() }, // Ensure id is a string
//         }));

//         return {
//             paths,
//             fallback: 'blocking', // 'blocking' ensures that new paths are built at request time
//         };
//     } catch (error) {
//         console.error('Error fetching paths:', error);
//         return {
//             paths: [],
//             fallback: 'blocking',
//         };
//     }
// }

// export async function getStaticProps({ params }) {
//     const { id } = params;

//     if (!id || typeof id !== 'string') {
//         return {
//             notFound: true, // Handle cases where id is not provided or invalid
//         };
//     }

//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mo365/${id}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch subscription data');
//         }
//         const subscription = await response.json();

//         return {
//             props: {
//                 id,
//                 initialSubscription: subscription,
//             },
//             revalidate: 10, // Optional: Revalidate at most every 10 seconds
//         };
//     } catch (error) {
//         console.error('Error fetching subscription data:', error);
//         return {
//             props: {
//                 id,
//                 initialSubscription: null,
//                 error: error.message,
//             },
//         };
//     }
// }

// export default SubscriptionDetailPage;
