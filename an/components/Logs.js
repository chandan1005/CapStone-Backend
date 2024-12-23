import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Logs = () => {
  const [logs, setLogs] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/logs');
        setLogs(response.data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Logs</Typography>
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <pre className="logs-pre">
          {logs}
        </pre>
      </Paper>
    </Container>
  );
};

export default Logs;
