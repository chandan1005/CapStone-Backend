// import React, { useState, useEffect } from 'react';
// import { Paper, Typography, Switch, FormControlLabel, Button, CircularProgress } from '@mui/material';
// import axios from 'axios';

// const AdminTools = () => {
//   const [loading, setLoading] = useState(false);
//   const [settings, setSettings] = useState({
//     signature_updates: 'weekly',
//     anomaly_detection: true,
//     threshold_tuning: true,
//     contextual_analysis: true,
//     whitelisting: true,
//     behavioral_analysis: true,
//     combine_detection_techniques: true,
//   });

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/prevention_settings');
//       setSettings(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//       setLoading(false);
//     }
//   };

//   const handleSaveSettings = async () => {
//     try {
//       setLoading(true);
//       await axios.post('/prevention_settings', settings);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       setLoading(false);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, checked, value } = event.target;
//     setSettings((prevSettings) => ({
//       ...prevSettings,
//       [name]: event.target.type === 'checkbox' ? checked : value,
//     }));
//   };

//   return (
//     <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
//       <Typography variant="h6" gutterBottom>Prevention Settings</Typography>
//       {loading ? <CircularProgress /> : (
//         <div>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.signature_updates === 'weekly'}
//                 onChange={handleChange}
//                 name="signature_updates"
//                 color="primary"
//                 value={settings.signature_updates === 'weekly' ? 'daily' : 'weekly'}
//               />
//             }
//             label="Signature Updates (Weekly/Daily)"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.anomaly_detection}
//                 onChange={handleChange}
//                 name="anomaly_detection"
//                 color="primary"
//               />
//             }
//             label="Anomaly Detection"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.threshold_tuning}
//                 onChange={handleChange}
//                 name="threshold_tuning"
//                 color="primary"
//               />
//             }
//             label="Threshold Tuning"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.contextual_analysis}
//                 onChange={handleChange}
//                 name="contextual_analysis"
//                 color="primary"
//               />
//             }
//             label="Contextual Analysis"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.whitelisting}
//                 onChange={handleChange}
//                 name="whitelisting"
//                 color="primary"
//               />
//             }
//             label="Whitelisting"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.behavioral_analysis}
//                 onChange={handleChange}
//                 name="behavioral_analysis"
//                 color="primary"
//               />
//             }
//             label="Behavioral Analysis"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={settings.combine_detection_techniques}
//                 onChange={handleChange}
//                 name="combine_detection_techniques"
//                 color="primary"
//               />
//             }
//             label="Combine Detection Techniques"
//           />
//           <Button variant="contained" color="primary" onClick={handleSaveSettings} style={{ marginTop: '20px' }}>
//             Save Settings
//           </Button>
//         </div>
//       )}
//     </Paper>
//   );
// };

// export default AdminTools;

import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Grid, FormControl, Select, MenuItem, Button } from '@mui/material';
import axios from 'axios';

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState('');
  const [preventionMethod, setPreventionMethod] = useState('');

  const detectionMethods = ['Port Scanning', 'DDoS Attack', 'Brute Force', 'Phishing', 'Malware'];
  const preventionMethods = ['Block IP', 'Send Email Alert', 'Send SMS Alert'];

  const handleDetectionMethod = async (method) => {
    setLoading(true);
    try {
      // Implement the endpoint call to trigger detection methods
      await axios.post('/trigger_detection', { method });
      setLoading(false);
    } catch (error) {
      console.error(`Error triggering ${method} detection:`, error);
      setLoading(false);
    }
  };

  const handlePreventionMethod = async (method) => {
    setLoading(true);
    try {
      // Implement the endpoint call to trigger prevention methods
      await axios.post('/trigger_prevention', { method });
      setLoading(false);
    } catch (error) {
      console.error(`Error triggering ${method} prevention:`, error);
      setLoading(false);
    }
  };

  const handleChangeDetectionMethod = (event) => {
    setDetectionMethod(event.target.value);
    handleDetectionMethod(event.target.value);
  };

  const handleChangePreventionMethod = (event) => {
    setPreventionMethod(event.target.value);
    handlePreventionMethod(event.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>Admin Tools</Typography>
      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Detection Methods</Typography>
            <FormControl fullWidth>
              <Select value={detectionMethod} onChange={handleChangeDetectionMethod}>
                {detectionMethods.map((method, index) => (
                  <MenuItem key={index} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Prevention Methods</Typography>
            <FormControl fullWidth>
              <Select value={preventionMethod} onChange={handleChangePreventionMethod}>
                {preventionMethods.map((method, index) => (
                  <MenuItem key={index} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default AdminTools;
