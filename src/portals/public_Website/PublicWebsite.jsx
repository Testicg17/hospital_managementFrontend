import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Home from './Home';
import About from './About';
import Services from './services';
import Articles from './Articles';
import Gallery from './Gallery';
import Contact from './Contact';

function PublicWebsite() {
  return (
    <PublicLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="articles" element={<Articles />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
}

export default PublicWebsite;
