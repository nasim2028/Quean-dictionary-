import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 md:py-20 px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        <span>কোরআনের শব্দভাণ্ডার</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
        কোরআনিক শব্দের <span className="text-emerald-600">গভীরতা</span> জানুন
      </h1>
      <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
        কোরআনের প্রতিটি শব্দের পেছনে লুকিয়ে আছে অসীম প্রজ্ঞা। বাহ্যিক অনুবাদের বাইরে গিয়ে শব্দের আসল ভাবার্থ এবং সূক্ষ্ম পার্থক্যগুলো আবিষ্কার করুন।
      </p>
    </div>
  );
};