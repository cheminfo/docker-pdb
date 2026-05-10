import { OverlaysProvider } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import AboutPage from './pages/about/AboutPage.tsx';
import AnimatePage from './pages/animate/AnimatePage.tsx';
import ApiPage from './pages/api/ApiPage.tsx';
import BrowsePage from './pages/browse/BrowsePage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import MoleculesPage from './pages/molecules/MoleculesPage.tsx';
import OmegaPage from './pages/omega/OmegaPage.tsx';
import SettingsPage from './pages/settings/SettingsPage.tsx';
import StatsPage from './pages/stats/StatsPage.tsx';
import Layout from './shared/Layout.tsx';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './styles.css';

const container = document.querySelector('#root');
if (!container) {
  throw new Error('Missing #root element in index.html.');
}

createRoot(container).render(
  <StrictMode>
    <OverlaysProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/animate" element={<AnimatePage />} />
            <Route path="/molecules" element={<MoleculesPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/omega" element={<OmegaPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </OverlaysProvider>
  </StrictMode>,
);
