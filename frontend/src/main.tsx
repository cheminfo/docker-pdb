import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import HomePage from './pages/home/HomePage.tsx';
import './styles.css';

const container = document.querySelector('#root');
if (!container) {
  throw new Error('Missing #root element in index.html.');
}

createRoot(container).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
