// src/App.jsx - Main Router
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPortal from './portals/AdminPortal';
import PatientPortal from './portals/PatientPortal';
import DoctorPortal from './portals/DoctorPortal';
import PublicWebsite from './portals/public_Website';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Portal Routes */}
        <Route path="/admin/*" element={<AdminPortal />} />
        
        {/* Patient Portal Routes */}
        <Route path="/patient/*" element={<PatientPortal />} />
         {/* Doctor Portal Routes */}
        <Route path="/doctor/*" element={<DoctorPortal />} />
        {/* Public Website Routes */}
        <Route path="/*" element={<PublicWebsite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
