import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { lazyPage } from './lazyPage';

const Home = lazyPage(() => import('./pages/Home'));
const Passwords = lazyPage(() => import('./pages/Passwords'));
const Phishing = lazyPage(() => import('./pages/Phishing'));
const Browsing = lazyPage(() => import('./pages/Browsing'));
const Social = lazyPage(() => import('./pages/Social'));
const Devices = lazyPage(() => import('./pages/Devices'));
const Tools = lazyPage(() => import('./pages/Tools'));
const Ai = lazyPage(() => import('./pages/Ai'));
const Advanced = lazyPage(() => import('./pages/Advanced'));

const TOPIC_PAGES = {
  passwords: Passwords,
  phishing: Phishing,
  browsing: Browsing,
  social: Social,
  devices: Devices,
  tools: Tools,
  ai: Ai,
  advanced: Advanced,
};

/** Loads the page chunk for a URL path; unknown paths redirect home, so they load Home. */
// eslint-disable-next-line react-refresh/only-export-components
export const preloadRoute = (pathname) => {
  const id = pathname.replace(/^\/+|\/+$/g, '');
  return (Object.hasOwn(TOPIC_PAGES, id) ? TOPIC_PAGES[id] : Home).preload();
};

const PageFallback = () => (
  <div className="page-loading" role="status" aria-live="polite">
    SEC101
  </div>
);

/** The route tree without a router: the browser wraps it in BrowserRouter, the prerender script in a StaticRouter. */
export function AppRoutes() {
  return (
    <ErrorBoundary>
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
            <Route path="ai" element={<Ai />} />
            <Route path="advanced" element={<Advanced />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
