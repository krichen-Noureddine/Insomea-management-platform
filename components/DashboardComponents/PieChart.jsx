import React from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material';
import { tokens } from '../../styles/theme';

const ResponsivePie = dynamic(() => import('@nivo/pie').then(m => m.ResponsivePie), { ssr: false });

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


    

  const data = [
    { id: "VMs", label: "VMs", value: 35, color: "hsl(26, 87%, 55%)" },
    { id: "Storage", label: "Storage", value: 25, color: "hsl(190, 70%, 50%)" },
    { id: "Databases", label: "Databases", value: 20, color: "hsl(120, 57%, 40%)" },
    { id: "Functions", label: "Functions", value: 10, color: "hsl(340, 82%, 52%)" },
    { id: "Networking", label: "Networking", value: 10, color: "hsl(210, 100%, 56%)" }
  ];

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={1}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ datum: 'data.color' }}  // Use color from data
      borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
      arcLinkLabelsTextColor={colors.primary[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      enableArcLinkLabels={true}
      arcLabelsRadiusOffset={0.7}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: colors.primary[100], // Set legend text color to primary[100]

          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
