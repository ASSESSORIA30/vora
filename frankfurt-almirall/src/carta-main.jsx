import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.js';
import './styles/base.css';
import './styles/sections.css';
import './styles/menu-page.css';
import MenuPage from './MenuPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuPage />
  </StrictMode>,
);
