import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.js';
import './styles/base.css';
import './styles/walk.css';
import './styles/sections.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
