import React from 'react';

function BrandMark({
  title = process.env.REACT_APP_HOSPITAL_NAME || 'Eva Fertility & Laparoscopy',
  subtitle = '',
  size = 'md',
  centered = false,
  className = ''
}) {
  const sizes = {
    sm: { wrap: 'h-10 w-10', image: 'h-9 w-9', title: 'text-lg', subtitle: 'text-xs' },
    md: { wrap: 'h-12 w-12', image: 'h-11 w-11', title: 'text-xl', subtitle: 'text-sm' },
    lg: { wrap: 'h-20 w-20', image: 'h-[4.5rem] w-[4.5rem]', title: 'text-3xl', subtitle: 'text-sm' }
  };

  const selected = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${centered ? 'flex-col text-center' : ''} ${className}`}>
      <span className={`flex ${selected.wrap} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-pink-100`}>
        <img
          src="/images/logo.jpeg"
          alt={`${title} logo`}
          className={`${selected.image} object-contain`}
        />
      </span>
      <span>
        <span className={`block font-bold leading-tight text-gray-800 ${selected.title}`}>{title}</span>
        {subtitle && <span className={`mt-1 block text-gray-600 ${selected.subtitle}`}>{subtitle}</span>}
      </span>
    </div>
  );
}

export default BrandMark;
