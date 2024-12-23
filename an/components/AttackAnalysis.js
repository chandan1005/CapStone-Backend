import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const AttackAnalysis = () => {
  const [analysisData, setAnalysisData] = useState([]);
  const [attackType, setAttackType] = useState('mitm_attacks');

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/analyze_attacks?type=${attackType}`);
        setAnalysisData(response.data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        setAnalysisData([]);  // Ensure it is an array on error
      }
    };

    fetchAnalysisData();
  }, [attackType]);

  const handleChangeAttackType = (event) => {
    setAttackType(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Attack Analysis</Typography>
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Attack Type</InputLabel>
          <Select value={attackType} onChange={handleChangeAttackType} label="Attack Type">
            <MenuItem value="mitm_attacks">MITM Attacks</MenuItem>
            <MenuItem value="spoofing_attacks">Spoofing Attacks</MenuItem>
            <MenuItem value="dns_spoofing_attacks">DNS Spoofing Attacks</MenuItem>
            <MenuItem value="https_spoofing_attacks">HTTPS Spoofing Attacks</MenuItem>
          </Select>
        </FormControl>
        <pre className="logs-pre">
          {JSON.stringify(analysisData, null, 2)}
        </pre>
      </Paper>
    </Container>
  );
};

export default AttackAnalysis;
