/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopNav } from './components/TopNav.tsx';
import { TextWorkspace } from './components/TextWorkspace.tsx';
import { StudioPlayer } from './components/StudioPlayer.tsx';
import { PhoneticsGuideModal } from './components/PhoneticsGuideModal.tsx';
import { LibraryModal } from './components/LibraryModal.tsx';
import { SAMPLE_TEXTS } from './lib/azerbaijani-phonetics.ts';
import { AlertCircle, Disc3, Mic2, ShieldCheck, Waves } from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [selectedVoice, setSelectedVoice] = useState<string>('Fenrir');
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioTitle, setAudioTitle] = useState<string>('Cəlil Məmmədquluzadə — "Poçt Qutusu"');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'workspace' | 'phonetics' | 'library'>('workspace');
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_TEXTS.find((s) => s.id === sampleId);
    if (found) {
      setText(found.text);
      setAudioTitle(found.title);
      setErrorMessage(null);
    }
  };

  const handleNewText = () => {
    setText('');
    setAudioTitle('Yeni Ədəbi Mətn');
    setAudioBase64(null);
    setErrorMessage(null);
  };

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setErrorMessage('Zəhmət olmasa oxunacaq mətni daxil edin.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice,
          speechStyle:
            selectedVoice === 'Fenrir'
              ? 'Dərin, təmkinli, sakit və emosional Azərbaycan ədəbi roman diktoru səsi. Hər bir cümləni aydın, orfoepiyaya və pauzalara qüsursuz əməl edərək oxu.'
              : 'Sakit, təbii və aydın Azərbaycan dili hekayəçi diktor səsi.',
          autoNormalize: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Səs sintezi uğursuz oldu.');
      }

      setAudioBase64(data.audioBase64);
      setAudioDuration(data.duration || 0);

      // Sərlövhəni yenilə
      const firstLine = text.trim().split('\n')[0].slice(0, 45);
      setAudioTitle(firstLine ? `${firstLine}...` : 'Səda Diktor Səsi');
    } catch (err: any) {
      console.error('Səs sintezi xətası:', err);
      setErrorMessage(err.message || 'Səs generasiyası zamanı server xətası baş verdi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewText={handleNewText}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenPhonetics={() => setIsPhoneticsOpen(true)}
      />

      {/* Hero Studio Showcase */}
      <section className="relative border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-[#0E1420] to-[#0B0F17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Kicker & Headline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-amber-400 font-semibold tracking-wide uppercase">Studiya Mühərriki</span>
              <span aria-hidden="true">·</span>
              <span>Dərin Kişi Diktoru</span>
              <span aria-hidden="true">·</span>
              <span>Ədəbi Orfoepiya</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Sıfır İtki Rejimi</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Azərbaycan Dili Audiobook və Səs Sintezi Mühərriki
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-serif">
              UTF-8 formatlı .txt mətnlərini və ədəbi əsərləri orfoepiya qaydalarına, sayların sözlə tam açılışına və durğu işarəsi nəfəs pauzalarına uyğunlaşdıraraq yüksək studiya standartında WAV və MP3 audio axınına çevirir.
            </p>

            {/* Quick Badges / Trust points (Zero pills, clean text) */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-amber-400" />
                <span>Ədəbi Tələffüz və Vurğu</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-amber-400" />
                <span>24kHz WAV & MP3 Birbaşa Çıxış</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nöqtəsinə Qədər Tam Mətn</span>
              </div>
            </div>
          </div>

          {/* Visual Studio Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-[16/10] bg-slate-900">
              <img
                src="/src/assets/images/studio_recording_booth_1792908872947.jpg"
                alt="Professional səs qeydiyyatı studiyası və vintage kondensator mikrofonu"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Səda Akustik Studiyası
                </span>
                <p className="text-xs text-slate-300">
                  Canlı, emosional və dinləyicini yormayan peşəkar hekayəçi tonu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Viewport */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex-1 w-full space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-red-200 cursor-pointer"
            >
              Bağla
            </button>
          </div>
        )}

        {/* Text Area & Phonetics Workspace */}
        <TextWorkspace
          text={text}
          setText={setText}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          onSynthesize={handleSynthesize}
          isLoading={isLoading}
          onSelectSample={handleSelectSample}
        />

        {/* Studio Player & Direct Audio Stream Export */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-amber-400" /> Studiya Səs Çıxışı və Pleyer
            </span>
            <span>Yalnız Təmiz Səs Çıxışı (Pure Audio)</span>
          </div>
          <StudioPlayer
            audioBase64={audioBase64}
            sampleRate={24000}
            duration={audioDuration}
            title={audioTitle}
            voiceName={
              selectedVoice === 'Fenrir'
                ? 'Fenrir (Dərin Kişi Diktoru)'
                : selectedVoice === 'Charon'
                ? 'Charon (Mülayim Kişi Diktoru)'
                : 'Kore (Lirik Qadın Diktoru)'
            }
          />
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 lg:px-12 text-xs text-slate-500 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Səda Studio</span>
            <span aria-hidden="true">·</span>
            <span>Azərbaycan Dili Ədəbi Audiobook və Səs Sintezi</span>
            <span aria-hidden="true">·</span>
            <span>UTF-8 Standartı</span>
          </div>
          <div className="text-slate-600">
            Orfoepiya, vurğu və durğu işarələri üzrə tam uyğunluq
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PhoneticsGuideModal
        isOpen={isPhoneticsOpen}
        onClose={() => setIsPhoneticsOpen(false)}
      />
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
