import React from 'react';
import { Container, Button, Typography, Grid } from '@mui/material';

const Download = () => {
  const downloadReport = () => {
    window.location.href = 'http://localhost:5000/download_report';
  };

  const downloadCapturedPackets = () => {
    window.location.href = 'http://localhost:5000/download_packets';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Download</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={downloadReport}>
            Download MITM Report
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={downloadCapturedPackets}>
            Download Captured Packets
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Download;
