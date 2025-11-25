import React from 'react';
import { WordEntry } from '../types';
import { BookOpen, Info, Bookmark, BookmarkCheck } from 'lucide-react';

interface WordCardProps {
  entry: WordEntry;
  isSaved: boolean;
  onToggleSave: (entry: WordEntry) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ entry, isSaved, onToggleSave }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden flex flex-col h-full relative group">
      {/* Save Button */}
      <button 
        onClick={() => onToggleSave(entry)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all shadow-sm backdrop-blur-sm ${
          isSaved 
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
            : 'bg-white/60 hover:bg-white text-slate-400 hover:text-emerald-600'
        }`}
        title={isSaved ? "ডিকশনারি থেকে সরান" : "ডিকশনারিতে সেভ করুন"}
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </button>

      {/* Header with Arabic */}
      <div className="bg-emerald-50/50 p-6 flex flex-col items-center justify-center border-b border-emerald-100 relative">
        <div className="absolute top-3 left-4 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full opacity-70">
          {entry.transliteration}
        </div>
        <h2 className="text-5xl font-arabic text-emerald-800 mb-2 mt-4 text-center leading-relaxed py-2">
          {entry.arabic}
        </h2>
        <p className="text-slate-500 text-sm mt-1">{entry.meaning}</p>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4 flex-grow">
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            <h3 className="font-semibold text-slate-800 text-lg">গভীর অর্থ</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-base pl-7">
            {entry.nuance}
          </p>
        </div>

        {/* Footer with Reference */}
        <div className="pt-4 mt-auto border-t border-slate-100">
          <div className="flex items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
            <span className="font-medium">{entry.reference}</span>
          </div>
        </div>
      </div>
    </div>
  );
};