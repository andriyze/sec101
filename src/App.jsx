import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const Passwords = lazy(() => import('./pages/Passwords'));
const Phishing = lazy(() => import('./pages/Phishing'));
const Browsing = lazy(() => import('./pages/Browsing'));
const Social = lazy(() => import('./pages/Social'));
const Devices = lazy(() => import('./pages/Devices'));
const Tools = lazy(() => import('./pages/Tools'));
const Advanced = lazy(() => import('./pages/Advanced'));

const PageFallback = () => (
  <div className="page-loading" role="status" aria-live="polite">
    SEC101
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="passwords" element={<Passwords />} />
            <Route path="phishing" element={<Phishing />} />
            <Route path="browsing" element={<Browsing />} />
            <Route path="social" element={<Social />} />
            <Route path="devices" element={<Devices />} />
            <Route path="tools" element={<Tools />} />
            <Route path="advanced" element={<Advanced />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
