import React from 'react';
import { X, BookOpen, User, Tag, ArrowRight } from 'lucide-react';
import { SAMPLE_TEXTS } from '../lib/azerbaijani-phonetics.ts';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (id: string) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1420] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Azərbaycan Klassik Ədəbiyyat Kitabxanası</h3>
            <p className="text-xs text-slate-400">Audiobook üçün seçilmiş zəngin ədəbi mətn nümunələri</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_TEXTS.map((sample) => (
            <div
              key={sample.id}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                    <User className="w-3 h-3" /> {sample.author}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {sample.genre}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">{sample.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 font-serif leading-relaxed italic">
                  &ldquo;{sample.text}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {sample.text.split(/\s+/).length} söz
                </span>
                <button
                  onClick={() => {
                    onSelectSample(sample.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Mətni Seç</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
