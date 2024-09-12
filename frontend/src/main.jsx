import React, { StrictMode } from 'react';
import ReactDom from 'react-dom/client'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
