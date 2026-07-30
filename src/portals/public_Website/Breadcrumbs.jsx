import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const labels = {
  about: 'About',
  services: 'Services',
  articles: 'Articles',
  blog: 'Blog',
  gallery: 'Gallery',
  contact: 'Contact',
  doctors: 'Doctors',
};

function formatLabel(segment) {
  return labels[segment] || segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  if (!segments.length) return null;

  const crumbs = segments.map((segment, index) => ({
    label: formatLabel(segment),
    path: `/${segments.slice(0, index + 1).join('/')}`,
  }));

  return (
    <nav aria-label="Breadcrumb" className="border-b border-pink-100 bg-white/70">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 sm:px-6 lg:px-8">
        <li>
          <Link to="/" className="text-[#3157b7] hover:text-[#e84faf]">Home</Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {index === crumbs.length - 1 ? (
              <span className="text-slate-700">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-[#3157b7] hover:text-[#e84faf]">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
