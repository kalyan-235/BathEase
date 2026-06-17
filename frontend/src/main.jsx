import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import Home       from './pages/index.jsx';
import Services   from './pages/services.jsx';
import Booking    from './pages/booking.jsx';
import Dashboard  from './pages/dashboard.jsx';
import Admin      from './pages/admin.jsx';
import Auth       from './pages/auth.jsx';
import NotFound   from './pages/not-found.jsx';

import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/booking"   element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin"     element={<Admin />} />
        <Route path="/auth"      element={<Auth />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
);
