import React, { useState, useCallback, useEffect } from 'react';
import { Search, RotateCcw, BookMarked, LayoutGrid } from 'lucide-react';
import { Hero } from './components/Hero';
import { WordCard } from './components/WordCard';
import { Loader } from './components/Loader';
import { ChatBot } from './components/ChatBot';
import { fetchQuranicNuances } from './services/geminiService';
import { INITIAL_WORDS, SUGGESTED_TOPICS } from './constants';
import { WordEntry, LoadingState } from './types';

const App: React.FC = () => {
  // --- Dictionary Logic ---
  const [savedWords, setSavedWords] = useState<WordEntry[]>(() => {
    try {
      const saved = localStorage.getItem('quranic_words_dictionary');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load dictionary", e);
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'explore' | 'dictionary'>('explore');

  const isWordSaved = useCallback((word: WordEntry) => {
    return savedWords.some(w => w.arabic === word.arabic && w.reference === word.reference);
  }, [savedWords]);

  const handleToggleSave = useCallback((word: WordEntry) => {
    setSavedWords(prev => {
      const exists = prev.some(w => w.arabic === word.arabic && w.reference === word.reference);
      let newSaved;
      if (exists) {
        newSaved = prev.filter(w => !(w.arabic === word.arabic && w.reference === word.reference));
      } else {
        newSaved = [word, ...prev]; // Add to top
      }
      localStorage.setItem('quranic_words_dictionary', JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  // --- Explore Logic ---
  const [words, setWords] = useState<WordEntry[]>(INITIAL_WORDS);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTopic, setCurrentTopic] = useState<string>('মানব সৃষ্টি');

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setCurrentTopic(searchTerm);
    setActiveTab('explore'); // Switch to explore tab on search
    
    try {
      const newWords = await fetchQuranicNuances(searchTerm);
      setWords(newWords);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  }, [searchTerm]);

  const handleTopicClick = useCallback(async (topic: string) => {
    const cleanTopic = topic.split('(')[0].trim(); 
    setSearchTerm(cleanTopic);
    
    setLoadingState(LoadingState.LOADING);
    setCurrentTopic(cleanTopic);
    setActiveTab('explore');
    
    try {
      const newWords = await fetchQuranicNuances(cleanTopic);
      setWords(newWords);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  const resetToInitial = useCallback(() => {
    setWords(INITIAL_WORDS);
    setSearchTerm('');
    setCurrentTopic('মানব সৃষ্টি');
    setLoadingState(LoadingState.IDLE);
    setActiveTab('explore');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans pb-20">
      {/* Background Pattern Hint */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Hero />

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              অনুসন্ধান
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dictionary'
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookMarked className="w-4 h-4 mr-2" />
              আমার ডিকশনারি
              {savedWords.length > 0 && (
                <span className="ml-2 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {savedWords.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'explore' ? (
          <>
            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-16">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="কোন বিষয়ে জানতে চান? (যেমন: জ্ঞান, মৃত্যু...)"
                  className="w-full py-4 pl-6 pr-14 text-lg rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm group-hover:shadow-md bg-white text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={loadingState === LoadingState.LOADING || !searchTerm.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Search className="w-6 h-6" />
                </button>
              </form>

              {/* Suggested Topics */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-slate-500 py-1.5 px-2">জনপ্রিয় বিষয়:</span>
                {SUGGESTED_TOPICS.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic)}
                    className="text-sm bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 text-slate-600 px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Section */}
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-4">
                  {loadingState === LoadingState.LOADING 
                    ? `${currentTopic} সম্পর্কে অনুসন্ধান করা হচ্ছে...` 
                    : `${currentTopic} সম্পর্কিত শব্দসমূহ`}
                </h2>
                
                {words !== INITIAL_WORDS && (
                  <button 
                    onClick={resetToInitial}
                    className="flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    প্রথম পাতা
                  </button>
                )}
              </div>

              {loadingState === LoadingState.LOADING ? (
                <Loader />
              ) : loadingState === LoadingState.ERROR ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100">
                  <p className="text-red-500 text-lg">দুঃখিত, তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।</p>
                  <button 
                    onClick={() => handleSearch()}
                    className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {words.map((word, idx) => (
                    <WordCard 
                      key={`${word.arabic}-${idx}`} 
                      entry={word} 
                      isSaved={isWordSaved(word)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
              
              {words.length === 0 && loadingState === LoadingState.SUCCESS && (
                 <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                 <p className="text-slate-500 text-lg">কোনো ফলাফল পাওয়া যায়নি। অন্য কোনো বিষয় অনুসন্ধান করুন।</p>
               </div>
              )}
            </div>
          </>
        ) : (
          /* Dictionary Tab Content */
          <div className="max-w-6xl mx-auto min-h-[50vh]">
             <div className="flex items-center mb-8 px-2">
                <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-4">
                  আমার ডিকশনারি ({savedWords.length})
                </h2>
            </div>
            
            {savedWords.length === 0 ? (
              <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookMarked className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">আপনার ডিকশনারি খালি</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  অনুসন্ধান ট্যাব থেকে যেকোনো কার্ডের বুকমার্ক আইকনে ক্লিক করে এখানে শব্দ যোগ করুন।
                </p>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  শব্দ খুঁজুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedWords.map((word, idx) => (
                  <WordCard 
                    key={`${word.arabic}-${idx}-saved`} 
                    entry={word} 
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Global ChatBot Component */}
      <ChatBot />

      <footer className="mt-24 text-center text-slate-400 text-sm">
        <p>© 2024 Quranic Nuance Explorer. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;