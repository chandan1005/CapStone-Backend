import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js
import 'chart.js/auto'; // Register necessary elements, controllers, scales, and plugins

const Graph = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Packet Statistics',
      data: [],
      backgroundColor: ['#66b2ff', '#ff7043', '#ffd9b3'],
    }],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch graph data from the backend
    const fetchGraphData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/graph_data');
        setGraphData(response.data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [graphData]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Packet Statistics</Typography>
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <div className="chart-container">
          <Line data={graphData} ref={chartRef} />
        </div>
      </Paper>
    </Container>
  );
};

export default Graph;
