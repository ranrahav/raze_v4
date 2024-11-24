import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

export default App;