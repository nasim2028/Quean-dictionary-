import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-4 text-emerald-700 font-medium animate-pulse">গবেষণা চলছে...</p>
  </div>
);