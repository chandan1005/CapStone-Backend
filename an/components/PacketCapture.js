import React, { useState } from 'react';
import { Container, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const PacketCapture = () => {
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [packets, setPackets] = useState([]);

  const startCapture = async () => {
    try {
      setLoading(true);
      setCapturing(true);
      await axios.post('http://localhost:5000/start_capture', { duration: 60 });
      setLoading(false);
    } catch (error) {
      console.error('Error starting packet capture:', error);
      alert('Failed to start packet capture. Please ensure the backend server is running.');
      setLoading(false);
    }
  };

  const stopCapture = async () => {
    try {
      setCapturing(false);
      await axios.post('http://localhost:5000/stop_capture');
    } catch (error) {
      console.error('Error stopping packet capture:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Packet Capture</Typography>
      <Button variant="contained" color="primary" onClick={startCapture} disabled={loading || capturing}>
        {loading ? <CircularProgress size={24} /> : 'Start Packet Capture'}
      </Button>
      <Button variant="contained" color="secondary" onClick={stopCapture} disabled={!capturing}>
        Stop Packet Capture
      </Button>
      <Typography variant="h6" style={{ marginTop: '20px' }}>Captured Packets:</Typography>
      <pre>{JSON.stringify(packets, null, 2)}</pre>
    </Container>
  );
};

export default PacketCapture;
