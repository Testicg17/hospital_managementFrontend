import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Home from './Home';
import About from './About';
import Services from './services';
import Articles from './Articles';
import Gallery from './Gallery';
import Contact from './Contact';
import Dr_Raveendra_Gondhali from './Dr_Raveendra_Gondhali';
import { LanguageProvider } from './LanguageContext';

function PublicWebsite() {
  return (
    // <LanguageProvider>
    //   <PublicLayout>
    //     <Routes>
    //       <Route index element={<Home />} />
    //       <Route path="about" element={<About />} />
    //       <Route path="services" element={<Services />} />
    //       <Route path="articles" element={<Articles />} />
    //       <Route path="gallery" element={<Gallery />} />
    //       <Route path="contact" element={<Contact />} />
    //       <Route path="*" element={<Navigate to="/" replace />} />
    //     </Routes>
    //   </PublicLayout>
    //    <Route path="Dr_Raveendra_Gondhali" element={<Dr_Raveendra_Gondhali />} />

    // </LanguageProvider>
    <LanguageProvider>
  <Routes>
    {/* Standalone route — no header/footer */}
    <Route path="Dr_Raveendra_Gondhali" element={<Dr_Raveendra_Gondhali />} />

    {/* Everything else keeps the site layout */}
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="articles" element={<Articles />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="contact" element={<Contact />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</LanguageProvider>
  );
}

export default PublicWebsite;
