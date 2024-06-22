import React from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material';
import { tokens } from '../../styles/theme';

const ResponsiveLine = dynamic(() => import('@nivo/line').then(m => m.ResponsiveLine), { ssr: false });

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define static data for Azure subscription costs
  const data = [
    {
      id: "Costs",
      data: [
        { x: "Jan", y: 200 },
        { x: "Feb", y: 180 },
        { x: "Mar", y: 220 },
        { x: "Apr", y: 230 },
        { x: "May", y: 205 },
        { x: "Jun", y: 240 },
        { x: "Jul", y: 245 },
        { x: "Aug", y: 250 },
        { x: "Sep", y: 265 },
        { x: "Oct", y: 280 },
        { x: "Nov", y: 300 },
        { x: "Dec", y: 320 },
      ],
    }
  ];

  return (
    
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.primary[100],
            },
          },
          legend: {
            text: {
              fill: colors.primary[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.primary[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.primary[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.primary[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[100],
          },
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Month',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Cost ($)',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
