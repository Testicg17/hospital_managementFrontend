// src/App.jsx - Main Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPortal from './portals/AdminPortal';
import PatientPortal from './portals/PatientPortal';
import DoctorPortal from './portals/DoctorPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Portal Routes */}
        <Route path="/admin/*" element={<AdminPortal />} />
        
        {/* Patient Portal Routes */}
        <Route path="/patient/*" element={<PatientPortal />} />
         {/* Doctor Portal Routes */}
        <Route path="/Doctor/*" element={<DoctorPortal />} />
        
        {/* Default redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* 404 fallback */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
              <div className="space-x-4">
                <a href="/admin" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go to Admin Portal
                </a>
                  <a href="/Doctor" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Go to Doctor Portal
                </a>
                <a href="/patient" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Go to Patient Portal
                </a>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;