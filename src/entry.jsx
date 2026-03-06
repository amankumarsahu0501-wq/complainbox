import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ComplaintProvider } from './context/ComplaintContext.jsx';
import { initializeStorage } from './data/mockData.js';

// Initialize local storage mock database mapping
initializeStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ComplaintProvider>
        <App />
      </ComplaintProvider>
    </AuthProvider>
  </StrictMode>,
);
