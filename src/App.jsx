import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Passwords from './pages/Passwords';
import Phishing from './pages/Phishing';
import Browsing from './pages/Browsing';
import Social from './pages/Social';
import Devices from './pages/Devices';
import TopicPage from './pages/TopicPage';
import Tools from './pages/Tools';
import Advanced from './pages/Advanced';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
