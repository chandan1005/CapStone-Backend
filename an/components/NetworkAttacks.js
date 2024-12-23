import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

const NetworkAttacks = () => {
  const [attackStats, setAttackStats] = useState({
    mitm_packets: 0,
    spoofing_packets: 0,
    dns_spoofing_packets: 0,
    https_spoofing_packets: 0,
    total_packets: 0,
  });

  useEffect(() => {
    // Fetch network attack stats from the backend
    const fetchAttackStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/network_attacks');
        setAttackStats(response.data);
      } catch (error) {
        console.error('Error fetching attack statistics:', error);
      }
    };

    fetchAttackStats();
  }, []);

  const calculatePercentage = (part, total) => {
    return total === 0 ? 0 : ((part / total) * 100).toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Network Attack Statistics</Typography>
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="body1">Total Packets: {attackStats.total_packets}</Typography>
        <Typography variant="body1">MITM Packets: {attackStats.mitm_packets} ({calculatePercentage(attackStats.mitm_packets, attackStats.total_packets)}%)</Typography>
        <Typography variant="body1">Spoofing Packets: {attackStats.spoofing_packets} ({calculatePercentage(attackStats.spoofing_packets, attackStats.total_packets)}%)</Typography>
        <Typography variant="body1">DNS Spoofing Packets: {attackStats.dns_spoofing_packets} ({calculatePercentage(attackStats.dns_spoofing_packets, attackStats.total_packets)}%)</Typography>
        <Typography variant="body1">HTTPS Spoofing Packets: {attackStats.https_spoofing_packets} ({calculatePercentage(attackStats.https_spoofing_packets, attackStats.total_packets)}%)</Typography>
      </Paper>
    </Container>
  );
};

export default NetworkAttacks;
