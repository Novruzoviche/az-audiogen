import React from 'react';
import { X, BookCheck, Mic2, PauseCircle, HelpCircle } from 'lucide-react';

interface PhoneticsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneticsGuideModal: React.FC<PhoneticsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1420] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Azərbaycan Dili Orfoepiya və Diktor Qaydaları</h3>
            <p className="text-xs text-slate-400">Səda Studio mühərrikinin fonetik və intonasiya standartları</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <Mic2 className="w-3.5 h-3.5" /> 1. Fonetika və Ədəbi Tələffüz (Orfoepiya)
            </h4>
            <p className="text-slate-400">
              Azərbaycan ədəbi dilinin orfoepiya normalarına uyğun olaraq, sözlərin vurğusu əsasən son hecaya düşür. Xüsusi fonemlər (&quot;ə&quot;, &quot;ş&quot;, &quot;ç&quot;, &quot;ö&quot;, &quot;ü&quot;, &quot;ı&quot;, &quot;ğ&quot;) ləhcə və aksentsiz, təmiz rezonansla səsləndirilir.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400">ə [æ]</span>: Açıq ön sait
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400">ğ [ɣ]</span>: Boğaz samiti
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400">ı [ɯ]</span>: Qapalı arxa sait
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400">ö [œ] / ü [y]</span>: Dodaqlanan
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" /> 2. Saylar, İllər və Qısaltmaların Oxunuşu
            </h4>
            <p className="text-slate-400">
              Audiobook standartında heç bir rəqəm və ya simvol mexaniki şəkildə oxunmur:
            </p>
            <ul className="space-y-1.5 pl-3 list-disc text-slate-300">
              <li><strong className="text-white">1990-cı il</strong> $\rightarrow$ &quot;min doqquz yüz doxsanıncı il&quot;</li>
              <li><strong className="text-white">XX əsr</strong> $\rightarrow$ &quot;iyirminci əsr&quot;</li>
              <li><strong className="text-white">25 kq</strong> $\rightarrow$ &quot;iyirmi beş kiloqram&quot;</li>
              <li><strong className="text-white">100 AZN</strong> $\rightarrow$ &quot;yüz manat&quot;</li>
              <li><strong className="text-white">və s.</strong> $\rightarrow$ &quot;və sairə&quot;</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <PauseCircle className="w-3.5 h-3.5" /> 3. İntonasiya və Durğu İşarəsi Pauzaları
            </h4>
            <div className="space-y-1.5 text-slate-300">
              <p><strong className="text-white">Vergül (,)</strong>: 0.15–0.25 saniyəlik mikropauza və səs tonunun mülayim yüksəlişi.</p>
              <p><strong className="text-white">Nöqtə (.)</strong>: Cümlənin tamamlanması, səsin tonda enməsi və 0.5 saniyəlik tam nəfəs fasiləsi.</p>
              <p><strong className="text-white">Sual (?) və Nida (!)</strong>: Təbii sual intonasiyası və ifadəli ədəbi emosiya.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-[11px]">
            <strong>Sıfır İtki Zəmanəti (Zero Loss):</strong> Təqdim etdiyiniz mətndən heç bir söz və ya abzas ixtisar edilmir, kəsilmir və ya dəyişdirilmir. Hər cümlə son nöqtəsinə qədər tam oxunur.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
