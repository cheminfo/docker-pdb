import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import ApiPage from './pages/api/ApiPage.tsx';
import BrowsePage from './pages/browse/BrowsePage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import Layout from './shared/Layout.tsx';
import './styles.css';

const container = document.querySelector('#root');
if (!container) {
  throw new Error('Missing #root element in index.html.');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/api" element={<ApiPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
