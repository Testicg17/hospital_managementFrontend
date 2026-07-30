import React from 'react';

function LogoLoader({
  label = 'Loading...',
  fullscreen = false,
  overlay = false,
  compact = false,
  className = '',
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}>
      <div className={`relative ${compact ? 'h-12 w-12' : 'h-20 w-20'}`}>
        <span className="absolute inset-0 rounded-full border-4 border-pink-200" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#e84faf] border-r-[#3157b7] animate-spin" />
        <span className="absolute inset-2 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
          <img
            src="/images/logo-optimized.jpg"
            alt="Hospital Logo"
            className={`${compact ? 'h-7 w-7' : 'h-12 w-12'} animate-pulse object-contain`}
          />
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {!compact && <p className="mt-1 text-xs text-slate-500">Please wait a moment</p>}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
        <div className="rounded-xl bg-white px-8 py-7 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default LogoLoader;
