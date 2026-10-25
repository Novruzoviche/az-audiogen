import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileText,
  Volume2,
  BookOpen,
  Sparkles,
  Layers,
  Clock,
  Type,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  normalizeAzerbaijaniForSpeech,
  SAMPLE_TEXTS,
} from '../lib/azerbaijani-phonetics.ts';

interface TextWorkspaceProps {
  text: string;
  setText: (t: string) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  onSynthesize: () => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

export const TextWorkspace: React.FC<TextWorkspaceProps> = ({
  text,
  setText,
  selectedVoice,
  setSelectedVoice,
  onSynthesize,
  isLoading,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPhoneticPreview, setShowPhoneticPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Azerbaijani quick keyboard inserts
  const azeChars = ['ə', 'Ə', 'ş', 'Ş', 'ç', 'Ç', 'ö', 'Ö', 'ü', 'Ü', 'ı', 'I', 'ğ', 'Ğ'];

  const insertChar = (char: string) => {
    setText(text + char);
  };

  // Real-time phonetics normalization calculation
  const phoneticsData = useMemo(() => {
    return normalizeAzerbaijaniForSpeech(text);
  }, [text]);

  const handleFileUpload = (file: File) => {
    setFileError(null);
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setFileError('Zəhmət olmasa yalnız UTF-8 kodlaşdırmalı .txt mətn faylı təqdim edin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setText(content);
        setUploadedFileName(file.name);
      }
    };
    reader.onerror = () => {
      setFileError('Fayl oxunarkən xəta baş verdi. Kodlaşdırmanın UTF-8 olduğunu yoxlayın.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-6">
      {/* File Drop & Literary Samples Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#0E1420]/70">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-slate-700 shrink-0"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span>.txt Fayl Yüklə (UTF-8)</span>
          </button>

          {uploadedFileName && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 truncate">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{uploadedFileName}</span>
            </div>
          )}
        </div>

        {/* Sample pickers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Nümunələr:
          </span>
          {SAMPLE_TEXTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                onSelectSample(sample.id);
                setUploadedFileName(null);
              }}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800 rounded-md transition-colors border border-slate-800 whitespace-nowrap cursor-pointer"
            >
              {sample.author}
            </button>
          ))}
        </div>
      </div>

      {fileError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Main Text Editor with Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-xl border transition-all relative ${
          dragActive
            ? 'border-amber-400 bg-amber-500/5'
            : 'border-slate-800 bg-[#0E1420] focus-within:border-slate-700'
        }`}
      >
        {/* Editor Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-[#080B12]/60 rounded-t-xl text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Ədəbi Mətn
            </span>
            <span aria-hidden="true">·</span>
            <span>UTF-8 Sıfır İtki Rejimi</span>
          </div>

          {/* Quick Azerbaijani Character palette */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[11px] text-slate-500 mr-1">Əlifba:</span>
            {azeChars.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => insertChar(ch)}
                className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-serif transition-colors cursor-pointer"
                title={`Əlavə et: ${ch}`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Oxunacaq mətni buraya daxil edin və ya UTF-8 formatlı .txt faylı sürükləyib buraxın... Mətndəki rəqəmlər (məsələn: 1990-cı il, 25 kq, 100 manat) və qısaltmalar avtomatik ədəbi orfoepiya qaydalarına uyğun oxunacaq."
          rows={9}
          className="w-full bg-transparent p-5 text-slate-100 placeholder:text-slate-600 focus:outline-none text-base leading-relaxed font-serif resize-y"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        />

        {/* Live Metrics Footer (Zero-pill text separators) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-800/80 bg-[#080B12]/40 rounded-b-xl text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums text-slate-200">
              {phoneticsData.stats.originalWords} söz
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-200">
              {phoneticsData.stats.originalChars} simvol
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-200">
              {phoneticsData.stats.sentences} cümlə
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono tabular-nums">
              <Clock className="w-3 h-3" /> ~{Math.floor(phoneticsData.stats.estimatedSeconds / 60)} dəq {phoneticsData.stats.estimatedSeconds % 60} san
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowPhoneticPreview(!showPhoneticPreview)}
            className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showPhoneticPreview ? 'Orfoepiya Baxışını Gizlə' : 'Orfoepiya Baxışı'}</span>
          </button>
        </div>
      </div>

      {/* Phonetic & Orthoepy Normalized Inspection View */}
      {showPhoneticPreview && (
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ədəbi Fonetik Oxunuş Önbaxışı (Orfoepiya və Saylar)
            </span>
            <span className="text-slate-400">Söz itkisi yoxdur (Zero loss)</span>
          </div>
          <div className="p-4 rounded-lg bg-[#080B12] border border-slate-800 text-sm font-serif text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {phoneticsData.normalized || 'Mətn daxil edilmədikdə önbaxış boş qalır.'}
          </div>
          <p className="text-[11px] text-slate-500">
            Rəqəmlər, tarixlər, vahidlər və qısaltmalar Azərbaycan dilinin rəsmi fonetik və durğu işarəsi standartlarına uyğunlaşdırılmış şəkildə səsləndirilir.
          </p>
        </div>
      )}

      {/* Synthesis Configuration & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-[#0E1420]">
        {/* Voice Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Diktor Seçimi:
          </label>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedVoice('Fenrir')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedVoice === 'Fenrir'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fenrir (Dərin Kişi)
            </button>
            <button
              type="button"
              onClick={() => setSelectedVoice('Charon')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedVoice === 'Charon'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Charon (Mülayim Kişi)
            </button>
            <button
              type="button"
              onClick={() => setSelectedVoice('Kore')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedVoice === 'Kore'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kore (Lirik Qadın)
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          disabled={isLoading || !text.trim()}
          onClick={onSynthesize}
          className={`px-6 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg whitespace-nowrap shrink-0 ${
            isLoading || !text.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Sintez Edilir...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Səsi Sintez Et və Dinlə</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
