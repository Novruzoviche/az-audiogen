import React from 'react';
import { Headphones, Sparkles, BookOpen } from 'lucide-react';

interface TopNavProps {
  onNewText: () => void;
  onOpenLibrary: () => void;
  onOpenPhonetics: () => void;
  activeTab: 'workspace' | 'phonetics' | 'library';
  setActiveTab: (tab: 'workspace' | 'phonetics' | 'library') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onNewText,
  onOpenLibrary,
  onOpenPhonetics,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
          <Headphones className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          Səda Studio
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
            activeTab === 'workspace' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          İş Masası
        </button>
        <button
          onClick={() => {
            setActiveTab('phonetics');
            onOpenPhonetics();
          }}
          className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
            activeTab === 'phonetics' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Fonetik Orfoepiya
        </button>
        <button
          onClick={() => {
            setActiveTab('library');
            onOpenLibrary();
          }}
          className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
            activeTab === 'library' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Ədəbi Kitabxana
        </button>
      </nav>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewText}
          className="px-4 py-2 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm hover:shadow-amber-500/10 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yeni Mətn</span>
        </button>
      </div>
    </header>
  );
};
