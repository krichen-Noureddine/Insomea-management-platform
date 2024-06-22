import React from "react";
import dynamic from "next/dynamic";
import { tokens } from "../../styles/theme";
import { useTheme } from "@mui/material";

const ResponsiveBar = dynamic(() => import("@nivo/bar").then(m => m.ResponsiveBar), { ssr: false });

const BarChart = ({ isDashboard = false ,data}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const chartData = Object.entries(data).map(([organizationType, clients]) => ({
    organizationType,
    clients,
    clientsColor: "#b3cde3", // You can set a default color or calculate based on clients count
  }));
  return (
    <ResponsiveBar
    data={chartData}     
     theme={{
        // added
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
            fill: colors.grey[100],
          },
        },
      }}
      
    keys={["clients"]}
    indexBy="organizationType"
      margin={{ top: 50, right: 80, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id, data }) => data[`${id}Color`]}
      defs={[
        {
       
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Organization Type",
        legendPosition: "middle",
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Clients",
        legendPosition: "middle",
        legendOffset: -40,
      
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: { itemOpacity: 1 }
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} clients for organization type: ${e.indexValue}`}
    />
  );
};

export default BarChart;

