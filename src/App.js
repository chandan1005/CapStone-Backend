import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, Grid, Paper, TextField, colors } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import io from 'socket.io-client';
import { FaNetworkWired, FaDownload, FaLock, FaChartLine, FaTasks, FaFileAlt, FaCogs, FaEnvelope } from 'react-icons/fa';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const socket = io('http://localhost:5000');

const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' },
    secondary: { main: '#b71c1c' },
  },
  typography: {
    h4: { fontWeight: 'lighter', color: '#fff' },
    h6: { fontWeight: '500', color: 'lightblue' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '20px',
          marginTop: '20px',
          borderRadius: '8px',
          color: 'black',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'lightyellow',
          border: '1px solid #ddd'
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: '8px' } },
    },
    MuiTabs: {
      styleOverrides: {
        root: { backgroundColor: 'lightblue', color: '#fff', marginBottom: '20px' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 'bold', fontSize: '16px' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { color: 'purple', backgroundColor: 'lightgreen', marginBottom: '20px' },
      },
    },
  },
});

const App = () => {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Packet Statistics', data: [],
      backgroundColor: ['#66b2ff', '#ff7043', '#ffd9b3']
    }]
  });
  const [attackGraphData, setAttackGraphData] = useState({
    labels: [],
    datasets: []
  });
  const [packets, setPackets] = useState([]);
  const [capturedPackets, setCapturedPackets] = useState([]);
  const [filteredPackets, setFilteredPackets] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [attackStats, setAttackStats] = useState({
    mitm_packets: 0,
    arp_spoofing_packets: 0,
    dns_spoofing_packets: 0,
    https_spoofing_packets: 0,
    http_spoofing_packets: 0,
    ip_spoofing_packets: 0,
    email_hijacking_packets: 0,
    wifi_eavesdropping_packets: 0,
    phishing_attacks: 0,
    malware_attacks: 0,
    dos_attacks: 0,
    scanning_probing_attacks: 0,
    session_hijacking_attacks: 0,
    brute_force_attacks: 0,
    zero_day_attacks: 0,
    protocol_attacks: 0,
    insider_threats: 0,
    total_packets: 0
  });
  const [analysisData, setAnalysisData] = useState([]);
  const [attackType, setAttackType] = useState('mitm_attacks');
  const [logs, setLogs] = useState('');
  const [role, setRole] = useState('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    socket.on('packet_data', (data) => {
      setPackets((prevPackets) => [...prevPackets, data]);
      updateGraph(data);
      fetchAttackStats();
    });

    return () => {
      socket.off('packet_data');
    };
  }, []);

  useEffect(() => {
    setFilteredPackets(capturedPackets);
  }, [capturedPackets]);

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
      const response = await axios.get('http://localhost:5000/captured_packets');
      setCapturedPackets(response.data);
    } catch (error) {
      console.error('Error stopping packet capture:', error);
    }
  };

  const clearCapturedPackets = async () => {
    try {
      await axios.post('http://localhost:5000/clear_packets');
      setCapturedPackets([]);
      setFilteredPackets([]);
    } catch (error) {
      console.error('Error clearing captured packets:', error);
    }
  };

  const updateGraph = (data) => {
    setGraphData((prevState) => {
      const newLabels = [...prevState.labels, new Date().toLocaleTimeString()];
      const newDataset = [...prevState.datasets[0].data, data.total_packets];
      return {
        ...prevState,
        labels: newLabels,
        datasets: [{
          ...prevState.datasets[0],
          data: newDataset
        }]
      };
    });
  };

  const fetchAttackStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/network_attacks');
      setAttackStats(response.data);
      updateAttackGraph(response.data);
    } catch (error) {
      console.error('Error fetching attack statistics:', error);
    }
  };

  const updateAttackGraph = (attackStats) => {
    const mitmLabels = ['MITM', 'ARP Spoofing', 'DNS Spoofing', 'HTTPS Spoofing', 'HTTP Spoofing', 'IP Spoofing', 'Email Hijacking', 'Wi-Fi Eavesdropping'];
    const mitmDatasets = mitmLabels.map(label => ({
      label,
      data: [attackStats[`${label.toLowerCase().replace(/ /g, '_')}_packets`]],
      borderColor: getColor(label),
      borderWidth: 1
    }));

    if (role === 'admin') {
      const adminLabels = ['Phishing Attacks', 'Malware Attacks', 'DoS Attacks', 'Scanning/Probing Attacks', 'Session Hijacking', 'Brute Force Attacks', 'Zero-Day Attacks', 'Protocol Attacks', 'Insider Threats'];
      const adminDatasets = adminLabels.map(label => ({
        label,
        data: [attackStats[`${label.toLowerCase().replace(/ /g, '_')}`]],
        borderColor: getColor(label),
        borderWidth: 1
      }));
      setAttackGraphData({
        labels: [new Date().toLocaleTimeString()],
        datasets: [...mitmDatasets, ...adminDatasets]
      });
    } else {
      setAttackGraphData({
        labels: [new Date().toLocaleTimeString()],
        datasets: mitmDatasets
      });
    }
  };

  const getColor = (label) => {
    switch (label) {
      case 'MITM': return 'red';
      case 'ARP Spoofing': return 'blue';
      case 'DNS Spoofing': return 'green';
      case 'HTTPS Spoofing': return 'purple';
      case 'HTTP Spoofing': return 'orange';
      case 'IP Spoofing': return 'brown';
      case 'Email Hijacking': return 'pink';
      case 'Wi-Fi Eavesdropping': return 'black';
      case 'Phishing Attacks': return 'cyan';
      case 'Malware Attacks': return 'magenta';
      case 'DoS Attacks': return 'lime';
      case 'Scanning/Probing Attacks': return 'gold';
      case 'Session Hijacking': return 'grey';
      case 'Brute Force Attacks': return 'teal';
      case 'Zero-Day Attacks': return 'blueviolet';
      case 'Protocol Attacks': return 'orchid';
      case 'Insider Threats': return 'khaki';
      default: return 'grey';
    }
  };

  const fetchAnalysisData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/analyze_attacks?type=${attackType}`);
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setAnalysisData([]);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logs');
      setLogs(response.data.logs.reverse()); // Display latest logs at the top
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const searchLogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/filter_logs?search=${logSearchTerm}`);
      setLogs(response.data.logs.reverse().join('')); // Display latest logs at the top
    } catch (error) {
      console.error('Error searching logs:', error);
    }
  };

  const clearLogs = async () => {
    try {
      await axios.post('http://localhost:5000/clear_logs', { role });
      setLogs('');
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  const downloadReport = () => {
    axios.get('http://localhost:5000/download_mitm_report')
      .then(response => {
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'MITM_Report.csv');
        link.click();
      })
      .catch(error => {
        console.error('Error downloading MITM report:', error);
      });
  };

  const downloadCapturedPackets = () => {
    window.location.href = 'http://localhost:5000/download_packets';
  };

  const downloadDPIFiles = () => {
    // Implement the download logic for DPI files
    window.location.href = 'http://localhost:5000/download_dpi';
  };

  const downloadDFIFiles = () => {
    // Implement the download logic for DFI files
    window.location.href = 'http://localhost:5000/download_dfi';
  };

  const downloadDCIFiles = () => {
    // Implement the download logic for DCI files
    window.location.href = 'http://localhost:5000/download_dci';
  };

  const fetchThreatIntelligence = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fetch_threat_intelligence');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching threat intelligence:', error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 3) {
      fetchAttackStats();
    } else if (newValue === 4) {
      fetchAnalysisData();
    } else if (newValue === 5) {
      fetchLogs();
    }
  };

  const handleChangeAttackType = (event) => {
    setAttackType(event.target.value);
    fetchAnalysisData();
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    fetchAttackStats(); // Update attack graph data when role changes
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === '') {
      setFilteredPackets(capturedPackets);
    } else {
      filterPackets(event.target.value);
    }
  };

  const filterPackets = async (search) => {
    try {
      const response = await axios.get(`http://localhost:5000/filter_packets?search=${search}`);
      setFilteredPackets(response.data);
    } catch (error) {
      console.error('Error filtering packets:', error);
    }
  };

  const calculatePercentage = (part, total) => {
    return total === 0 ? 0 : ((part / total) * 100).toFixed(2);
  };

  const sendReportByEmail = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send_report', { email });
      alert('Report sent successfully!');
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Failed to send report.');
    }
  };

  useEffect(() => {
    if (tabValue === 7) {
      fetchContentInspectionData();
    }
  }, [tabValue]);
  
  const fetchContentInspectionData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/content_inspection');
      setFilteredPackets(response.data);
    } catch (error) {
      console.error('Error fetching content inspection data:', error);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Network Monitor - {role.toUpperCase()}
        </Typography>
        <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={handleRoleChange} label="Role">
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </Select>
        </FormControl>
        <Tabs value={tabValue} onChange={handleChangeTab} centered>
          <Tab icon={<FaNetworkWired />} label="Capture" />
          <Tab icon={<FaChartLine />} label="Graph" />
          <Tab icon={<FaDownload />} label="Download" />
          <Tab icon={<FaLock />} label="Network Attacks" />
          <Tab icon={<FaTasks />} label="Attack Analysis" />
          <Tab icon={<FaFileAlt />} label="Logs" />
          {role === 'admin' && <Tab icon={<FaCogs />} label="Admin Tools" />}
          {role === 'admin' && <Tab icon={<FaEnvelope />} label="Content Inspection" />}
        </Tabs>
        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item>
              <Button className="capture-button" variant="contained" onClick={startCapture} disabled={loading || capturing}>
                {loading ? <CircularProgress size={24} /> : 'Start Packet Capture'}
              </Button>
            </Grid>
            <Grid item>
              <Button className="capture-button" variant="contained" onClick={stopCapture} disabled={!capturing}>
                Stop Packet Capture
              </Button>
            </Grid>
            <Grid item>
              <Button className="capture-button" variant="contained" onClick={clearCapturedPackets}>
                Clear Captured Packets
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Protocol, Source IP, Destination IP, or Attack Type"
                style={{ marginBottom: '10px' }}
              />
              <Paper elevation={3} style={{ padding: '5px', marginTop: '8px', border: '2px solid black' }}>
                <Typography variant="h6" style={{ textAlign: 'center', color: 'red' }}>Captured Packets</Typography>
                <table className="styled-table">
                  <thead style={{ border: '2px solid black' }}>
                    <tr style={{ border: '2px solid black' }}>
                      <th style={{ border: '2px solid black' }}>Source IP</th>
                      <th style={{ border: '2px solid black' }}>Destination IP</th>
                      <th style={{ border: '2px solid black' }}>Protocol</th>
                      <th style={{ border: '2px solid black' }}>Security Threats</th>
                      <th style={{ border: '2px solid black' }}>Compliance Monitoring</th>
                      <th style={{ border: '2px solid black' }}>Traffic Analysis</th>
                    </tr>
                  </thead>
                  <tbody style={{ border: '2px solid black' }}>
                    {filteredPackets.map((packet, index) => (
                      <tr key={index} style={{ border: '2px solid black' }}>
                        <td style={{ border: '2px solid black' }}>{packet.src}</td>
                        <td style={{ border: '2px solid black' }}>{packet.dst}</td>
                        <td style={{ border: '2px solid black' }}>{packet.protocol}</td>
                        <td style={{ border: '2px solid black' }}>{packet.security_threats || 'N/A'}</td>
                        <td style={{ border: '2px solid black' }}>{packet.compliance_monitoring || 'N/A'}</td>
                        <td style={{ border: '2px solid black' }}>{packet.traffic_analysis || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Grid>
          </Grid>
        )}
        {tabValue === 1 && (
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Packet Capture Statistics</Typography>
            <div className="chart-container">
              <Line data={graphData} />
            </div>
          </Paper>
        )}
        {tabValue === 2 && (
          <Grid container spacing={2}>
            <Grid item>
              <Button className="download-button" variant="contained" onClick={downloadReport}>
                Download MITM Report
              </Button>
            </Grid>
            <Grid item>
              <Button className="download-button" variant="contained" onClick={downloadCapturedPackets}>
                Download Captured Packets
              </Button>
            </Grid>
            <Grid item>
              <Button className="download-button" variant="contained" onClick={downloadDPIFiles}>
                Download DPI Files
              </Button>
            </Grid>
            <Grid item>
              <Button className="download-button" variant="contained" onClick={downloadDFIFiles}>
                Download DFI Files
              </Button>
            </Grid>
            <Grid item>
              <Button className="download-button" variant="contained" onClick={downloadDCIFiles}>
                Download DCI Files
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{ marginBottom: '20px' }}
              />
              <Button className="email-button" variant="contained" color="primary" onClick={sendReportByEmail}>
                <FaEnvelope style={{ marginRight: '8px' }} /> Send Report by Email
              </Button>
            </Grid>
          </Grid>
        )}
        {tabValue === 3 && (
          <>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h6">Network Attack Statistics</Typography>
              <div className="chart-container">
                <Line data={attackGraphData} />
              </div>
              <Typography variant="body1">
                Total Packets: {attackStats.total_packets}
              </Typography>
              <Typography variant="body1">
                MITM Packets: {attackStats.mitm_packets} ({calculatePercentage(attackStats.mitm_packets, attackStats.total_packets)}%)
                {attackStats.mitm_packets > 0 && (
                  <><br /><span style={{ color: 'blue' }}><b>Prevention: Dynamic ARP Inspection, DNSSEC, Certificate Pinning</b></span></>
                )}
              </Typography>
              <Typography variant="body1">
                ARP Spoofing Packets: {attackStats.arp_spoofing_packets} ({calculatePercentage(attackStats.arp_spoofing_packets, attackStats.total_packets)}%)
              </Typography>
              <Typography variant="body1">
                DNS Spoofing Packets: {attackStats.dns_spoofing_packets} ({calculatePercentage(attackStats.dns_spoofing_packets, attackStats.total_packets)}%)
                {attackStats.dns_spoofing_packets > 0 && (
                  <><br /><span style={{ color: 'blue' }}><b>Prevention: Secure DNS Servers (DNSSEC)</b></span></>
                )}
              </Typography>
              <Typography variant="body1">
                HTTPS Spoofing Packets: {attackStats.https_spoofing_packets} ({calculatePercentage(attackStats.https_spoofing_packets, attackStats.total_packets)}%)
                {attackStats.https_spoofing_packets > 0 && (
                  <><br /><span style={{ color: 'blue' }}><b>Prevention: Enforce HTTPS (HSTS)</b></span></>
                )}
              </Typography>
              <Typography variant="body1">
                HTTP Spoofing Packets: {attackStats.http_spoofing_packets} ({calculatePercentage(attackStats.http_spoofing_packets, attackStats.total_packets)}%)
              </Typography>
              <Typography variant="body1">
                IP Spoofing Packets: {attackStats.ip_spoofing_packets} ({calculatePercentage(attackStats.ip_spoofing_packets, attackStats.total_packets)}%)
              </Typography>
              <Typography variant="body1">
                Email Hijacking Packets: {attackStats.email_hijacking_packets} ({calculatePercentage(attackStats.email_hijacking_packets, attackStats.total_packets)}%)
              </Typography>
              <Typography variant="body1">
                Wi-Fi Eavesdropping Packets: {attackStats.wifi_eavesdropping_packets} ({calculatePercentage(attackStats.wifi_eavesdropping_packets, attackStats.total_packets)}%)
              </Typography>
              {role === 'admin' && (
                <>
                  <Typography variant="body1">
                    Phishing Attacks: {attackStats.phishing_attacks} ({calculatePercentage(attackStats.phishing_attacks, attackStats.total_packets)}%)
                    {attackStats.phishing_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Email Authentication (SPF, DKIM, DMARC), User Training, URL Filtering</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Malware Attacks: {attackStats.malware_attacks} ({calculatePercentage(attackStats.malware_attacks, attackStats.total_packets)}%)
                    {attackStats.malware_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Antivirus Software, Endpoint Protection, Regular Updates</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    DoS Attacks: {attackStats.dos_attacks} ({calculatePercentage(attackStats.dos_attacks, attackStats.total_packets)}%)
                    {attackStats.dos_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Rate Limiting, Traffic Filtering, Load Balancing</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Scanning/Probing Attacks: {attackStats.scanning_probing_attacks} ({calculatePercentage(attackStats.scanning_probing_attacks, attackStats.total_packets)}%)
                    {attackStats.scanning_probing_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Firewall Rules, IDS</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Session Hijacking: {attackStats.session_hijacking_attacks} ({calculatePercentage(attackStats.session_hijacking_attacks, attackStats.total_packets)}%)
                    {attackStats.session_hijacking_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Secure Sessions (HTTPS), Session Management</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Brute Force Attacks: {attackStats.brute_force_attacks} ({calculatePercentage(attackStats.brute_force_attacks, attackStats.total_packets)}%)
                    {attackStats.brute_force_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Account Lockout, Multi-Factor Authentication (MFA)</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Zero-Day Attacks: {attackStats.zero_day_attacks} ({calculatePercentage(attackStats.zero_day_attacks, attackStats.total_packets)}%)
                    {attackStats.zero_day_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Regular Patching, Threat Intelligence</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Protocol Attacks: {attackStats.protocol_attacks} ({calculatePercentage(attackStats.protocol_attacks, attackStats.total_packets)}%)
                    {attackStats.protocol_attacks > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Secure Protocols, Regular Updates</b></span></>
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Insider Threats: {attackStats.insider_threats} ({calculatePercentage(attackStats.insider_threats, attackStats.total_packets)}%)
                    {attackStats.insider_threats > 0 && (
                      <><br /><span style={{ color: 'blue' }}><b>Prevention: Role-Based Access Control (RBAC), User Training</b></span></>
                    )}
                  </Typography>
                </>
              )}
            </Paper>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h6">DPI, DFI, DCI Information</Typography>
              <Typography variant="body1">
                {/* Display relevant DPI, DFI, DCI information here */}
              </Typography>
            </Paper>
          </>
        )}
        {tabValue === 4 && (
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Attack Analysis</Typography>
            <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>Attack Type</InputLabel>
              <Select value={attackType} onChange={handleChangeAttackType} label="Attack Type">
                <MenuItem value="mitm_attacks">MITM Attacks</MenuItem>
                <MenuItem value="arp_spoofing_attacks">ARP Spoofing Attacks</MenuItem>
                <MenuItem value="dns_spoofing_attacks">DNS Spoofing Attacks</MenuItem>
                <MenuItem value="https_spoofing_attacks">HTTPS Spoofing Attacks</MenuItem>
                <MenuItem value="http_spoofing_attacks">HTTP Spoofing Attacks</MenuItem>
                <MenuItem value="ip_spoofing_attacks">IP Spoofing Attacks</MenuItem>
                <MenuItem value="email_hijacking_attacks">Email Hijacking Attacks</MenuItem>
                <MenuItem value="wifi_eavesdropping_attacks">Wi-Fi Eavesdropping Attacks</MenuItem>
                {role === 'admin' && (
                  <>
                    <MenuItem value="phishing_attacks">Phishing Attacks</MenuItem>
                    <MenuItem value="malware_attacks">Malware Attacks</MenuItem>
                    <MenuItem value="dos_attacks">DoS Attacks</MenuItem>
                    <MenuItem value="scanning_probing_attacks">Scanning/Probing Attacks</MenuItem>
                    <MenuItem value="session_hijacking_attacks">Session Hijacking</MenuItem>
                    <MenuItem value="brute_force_attacks">Brute Force Attacks</MenuItem>
                    <MenuItem value="zero_day_attacks">Zero-Day Attacks</MenuItem>
                    <MenuItem value="protocol_attacks">Protocol Attacks</MenuItem>
                    <MenuItem value="insider_threats">Insider Threats</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
            <pre className="logs-pre">{JSON.stringify(analysisData, null, 2)}</pre>
          </Paper>
        )}
        {tabValue === 5 && (
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Logs</Typography>
            <TextField
              label="Search Logs"
              variant="outlined"
              fullWidth
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
              placeholder="Search logs by keywords"
              style={{ marginBottom: '20px' }}
            />
            <Button className="search-logs-button" variant="contained" onClick={searchLogs} style={{ marginBottom: '20px', marginRight: '10px' }}>
              Search Logs
            </Button>
            {role === 'admin' && (
              <Button className="clear-logs-button" variant="contained" color="secondary" onClick={clearLogs}>
                Clear Logs
              </Button>
            )}
            <pre className="logs-pre">{logs}</pre>
          </Paper>
        )}
        {role === 'admin' && tabValue === 6 && (
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Admin Tools</Typography>
            <Button variant="contained" color="secondary" onClick={fetchThreatIntelligence}>
              Fetch Threat Intelligence
            </Button>
          </Paper>
        )}
        {role === 'admin' && tabValue === 7 && (
  <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
    <Typography variant="h6">Content Inspection</Typography>
    <table className="styled-table">
      <thead style={{ border: '2px solid black' }}>
        <tr style={{ border: '2px solid black' }}>
          <th style={{ border: '2px solid black' }}>Source IP</th>
          <th style={{ border: '2px solid black' }}>Destination IP</th>
          <th style={{ border: '2px solid black' }}>Content Filtering</th>
          <th style={{ border: '2px solid black' }}>Application Control</th>
          <th style={{ border: '2px solid black' }}>Data Loss Prevention</th>
          <th style={{ border: '2px solid black' }}>Real-Time Monitoring</th>
        </tr>
      </thead>
      <tbody style={{ border: '2px solid black' }}>
        {filteredPackets.map((packet, index) => (
          <tr key={index} style={{ border: '2px solid black' }}>
            <td style={{ border: '2px solid black' }}>{packet.src}</td>
            <td style={{ border: '2px solid black' }}>{packet.dst}</td>
            <td style={{ border: '2px solid black' }}>{packet.content_filtering || 'N/A'}</td>
            <td style={{ border: '2px solid black' }}>{packet.application_control || 'N/A'}</td>
            <td style={{ border: '2px solid black' }}>{packet.data_loss_prevention || 'N/A'}</td>
            <td style={{ border: '2px solid black' }}>{packet.real_time_monitoring || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Paper>
)}

      </Container>
    </ThemeProvider>
  );
};

export default App;
