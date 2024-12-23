import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import PacketCapture from './components/PacketCapture';
import Graph from './components/Graph';
import Download from './components/Download';
import NetworkAttacks from './components/NetworkAttacks';
import AttackAnalysis from './components/AttackAnalysis';
import Logs from './components/Logs';
import './App.css';

const theme = createTheme();

const useStyles = makeStyles(() => ({
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" style={{ width: `calc(100% - ${classes.drawer.width}px)`, marginLeft: classes.drawer.width }}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Network Intrusion Detection System
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Toolbar />
            <List>
              <ListItem button component="a" href="/">
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button component="a" href="/packet-capture">
                <ListItemText primary="Packet Capture" />
              </ListItem>
              <ListItem button component="a" href="/graph">
                <ListItemText primary="Graph" />
              </ListItem>
              <ListItem button component="a" href="/download">
                <ListItemText primary="Download" />
              </ListItem>
              <ListItem button component="a" href="/network-attacks">
                <ListItemText primary="Network Attacks" />
              </ListItem>
              <ListItem button component="a" href="/attack-analysis">
                <ListItemText primary="Attack Analysis" />
              </ListItem>
              <ListItem button component="a" href="/logs">
                <ListItemText primary="Logs" />
              </ListItem>
            </List>
          </Drawer>
          <main className={classes.content}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/packet-capture" element={<PacketCapture />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/download" element={<Download />} />
              <Route path="/network-attacks" element={<NetworkAttacks />} />
              <Route path="/attack-analysis" element={<AttackAnalysis />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
