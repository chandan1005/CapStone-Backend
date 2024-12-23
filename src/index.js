import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import All from './all';
import reportWebVitals from './reportWebVitals';
import Main from './Detect';
import Prevent from './prevent';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    {/* <Main/> */}
    {/* <All/> */}
    {/* <Prevent/> */}
  </React.StrictMode>
);

reportWebVitals();
