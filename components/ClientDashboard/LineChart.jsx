import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../../styles/ClientDashboard/LineChart.module.css'; // Adjust the import path as necessary

const LineChart = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Demo Line Plot',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.7)', // Enhanced visibility
                pointBackgroundColor: 'rgb(75, 192, 192)', // Points color
                pointBorderColor: '#ffffff', // White borders for points for better visibility
                tension: 0.1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#ffffff' // Makes tick labels white for visibility
                }
            },
            x: {
                ticks: {
                    color: '#ffffff' // Makes tick labels white for visibility
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff' // Makes legend text white for better readability
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className={styles.chartContainer}> {/* Use the styled container */}
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
