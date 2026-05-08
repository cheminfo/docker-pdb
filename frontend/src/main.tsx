import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import AboutPage from './pages/about/AboutPage.tsx';
import ApiPage from './pages/api/ApiPage.tsx';
import BrowsePage from './pages/browse/BrowsePage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import OmegaPage from './pages/omega/OmegaPage.tsx';
import StatsPage from './pages/stats/StatsPage.tsx';
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
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/omega" element={<OmegaPage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
