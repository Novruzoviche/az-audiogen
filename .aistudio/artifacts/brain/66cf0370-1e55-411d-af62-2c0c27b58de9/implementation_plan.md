# Səda — Qabaqcıl Azərbaycan Dili Audiobook və Səs Sintezi Mühərriki

Azərbaycan dilində UTF-8 mətnləri və .txt fayllarını ədəbi orfoepiya qaydalarına, vurğu incəliklərinə və durğu işarələri nəfəs pauzalarına uyğunlaşdıraraq dərin və təmkinli kişi diktor səsi ilə studiya keyfiyyətli WAV/MP3 audio axınına çevirən peşəkar audiobook mühərriki.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> İstifadəçi ilə dəqiqləşdirilmiş seçimlər və əsas arxitektura qərarları:

- **Seçilmiş Diktor Səsi**: Dərin və təmkinli kişi diktor səsi (Deep & Calm Male Narrator — Gemini TTS `Fenrir` / `Charon` akustik profili, studiya audio kitab hekayəçi tonu).
- **Çıxış Formatı**: Birbaşa WAV və MP3 fayl ixracı (Studio-grade WAV 24kHz / MP3 formatında yükləmə) və inteqrasiya olunmuş studiya dinləmə/vizualizasiya modulu.
- **Mətn Emalı və Sıfır İtki (Zero Loss)**: Giriş mətni heç bir ixtisara uğramadan tam oxunur. Rəqəmlər ("1990-cı il" $\to$ "min doqquz yüz doxsanıncı il"), faizlər, vahidlər və qısaltmalar Azərbaycan dilinin rəsmi orfoepiya qaydalarına uyğun genişləndirilir.

---

### 1. Overview & Core Concept

**Səda Studio**, Azərbaycan dilinin fonetik qanunauyğunluqlarına (orfoepiya, incə və qalın sait harmoniyası, "ə", "ğ", "ı", "ö", "ü", "ç", "ş" hərflərinin təbii səslənməsi) tam cavab verən, robotik və sürətli xəbər tərzindən uzaq, dərin, təmkinli və emosional roman/hekayə diktoru təqdim edir.

#### Əsas Hədəf və İxtisaslaşma:
- **Ədəbi Orfoepiya və Vurğu Uyğunlaşdırılması**: Sözlərin yazılışı ilə tələffüzü arasındakı fərqləri tənzimləyən qabaqcıl fonetik mühərrik.
- **Rəqəm və Qısaltmaların Oxunuşu**: Tarixlər, sıra sayları, miqdar sayları və mürəkkəb qısaltmaların avtomatik ana dilində tam açılışı.
- **Durğu İşarələri İntonasiyası**: Vergüllərdə mikropauza və səs tonunun qalxması, nöqtələrdə dərin nəfəs fasiləsi (0.5 san), sual və nida cümlələrində canlı intonasiya.
- **Sıfır İtki Rejimi (Zero Loss)**: Mətnin bütövlüyü toxunulmaz qalır, abzaslar və cümlələr itkisiz emal olunur.
- **Çıxış**: Yüksək keyfiyyətli WAV audio axını və birbaşa MP3/WAV endirmə düyməsi.

---

### 2. User Experience & Visual Design

#### A. Vizual Stil və Əhval
- **Aesthetic Direction**: "Acoustic Editorial & Dark Studio" — Peşəkar səs qeydiyyatı studiyası ab-havası. Dərin qara-şifer fon (`#0B0F17`), zərif tunc/kəhrəba vurğusu (`#F59E0B` / `#D97706`), minimalist ağac və səs avadanlığı dəqiqliyi.
- **Zero-Pill Restraint**: Heç bir gərəksiz həb (pill) və ya bəzəkli nişan qoyulmur. Bütün statistikalar və parametrlər zərif tipoqrafik ayırıcılarla (`·` və ya `/`) təqdim edilir.
- **Tipoqrafiya**: Başlıqlar üçün xarakterik və təmkinli sans şrifti (`Plus Jakarta Sans`), ədəbi mətnlər və oxuma rejimi üçün yüksək oxunaqlılıqlı ədəbi şrift (`Source Serif 4` / `Merriweather`), audio parametrlər üçün tabular rəqəmlər (`font-mono tabular-nums`).

#### B. Əsas İstifadəçi Axınları
1. **Mətn Daxiletmə / Yükləmə**:
   - UTF-8 formatlı `.txt` faylını sürükləyib buraxmaq (Drag & Drop) və ya birbaşa mətni yapışdırmaq.
   - Klassik Azərbaycan ədəbiyyatından nümunələri seçmək (məsələn: Cəlil Məmmədquluzadə "Poçt qutusu", Mir Cəlal "Bir gəncin manifesti", Nizami Gəncəvi "Sirlər xəzinəsi" hekayəti).
2. **Fonetik Analiz və Orfoepiya Baxışı**:
   - Rəqəmlərin, illərin və qısaltmaların sözlərlə fonetik açılışını canlı önbaxışda görmək (orijinal mətni itirmədən).
   - Simvol sayı, cümlə sayı, təxmini dinləmə müddəti (dəqiqələr və saniyələr).
3. **Studiya Sintezi və İcra**:
   - Server tərəfində `@google/genai` audio modeli (`gemini-3.8-flash-lite-tts` və ya `gemini-3.8-flash-tts`) ilə yüksək keyfiyyətli 24kHz WAV sintezi.
   - Səs tempini tənzimləmək (0.85x – 1.15x təbii hekayəçi sürəti).
4. **Çıxış və İxrac (Direct Export)**:
   - "WAV Yüklə" və "MP3 Yüklə" birbaşa ixrac düymələri.
   - İnteraktiv audio pleyer: səs dalğası (Waveform canvas), pauza/davam, saniyəlik irəli/geri (10s), həcm tənzimləyicisi və vizual oxu izləməsi.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side Audio Sintezi**: Bütün Gemini API çağırışları gizli açar qorunmaqla `server.ts` / `/api/synthesize` marşrutunda həyata keçirilir.
- **Uzun Mətnlərin Ağıllı Bölünməsi (Intelligent Paragraph Chunking)**: Böyük audio kitab bölümləri cümlə və abzas sərhədləri pozulmadan semantik bloklara ayrılır, hər blok sintez edilir və fasiləsiz təmiz WAV buferinə birləşdirilir (44 baytlıq RIFF başlığı qorunmaqla).
- **Yerli WAV / MP3 Konvertasiyası**: WAV buferini təmiz audio fayl kimi yükləmək üçün `Blob` və audio konteynerlərindən istifadə edilir, heç bir xarici üçüncü tərəf asılılığı olmadan brauzerdə təhlükəsiz saxlanılır.
- **Təhlükəsiz UTF-8 Dəstəyi**: Azərbaycan əlifbasının bütün xüsusi hərfləri ("ə", "ı", "ö", "ü", "ç", "ş", "ğ") düzgün bayt ardıcıllığında emal olunur.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Brauzer Müştərisi                    │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │ .txt Fayl / Mətn Sahəsi│   │ Studiya İdarə Paneli │  │
│  │ UTF-8 Yoxlanışı       │   │ Səs / Temp / Rejim   │  │
│  └───────────┬───────────┘   └──────────┬───────────┘  │
│              │                          │              │
│              ▼                          ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Orfoepiya & Fonetik Normalizasiya Modulu     │  │
│  │   - Sayların sözlə yazılışı ("1990" -> "min...") │  │
│  │   - Durğu işarələri və intonasiya tənzimləməsi   │  │
│  └───────────────────────┬──────────────────────────┘  │
└──────────────────────────┼─────────────────────────────┘
                           │ POST /api/synthesize (Mətn, Səs)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Server (Node.js / Express)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ @google/genai SDK (gemini-3.8-flash-lite-tts)    │  │
│  │ Voice: "Fenrir" (Dərin kişi bariton diktor)      │  │
│  │ Context: Ədəbi Azərbaycan hekayə intonasiyası    │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          │                             │
│                          ▼                             │
│              24kHz 16-bit Mono WAV Buffer              │
└──────────────────────────┼─────────────────────────────┘
                           │ Binary Stream / Base64 Audio
                           ▼
┌────────────────────────────────────────────────────────┐
│            Studiya Pleyeri & Birbaşa İxrac             │
│  - Real-time Waveform Canvas Vizualizasiyası           │
│  - Birbaşa WAV Yüklə / MP3 Yüklə                       │
│  - Oxunan mətndə cari cümlənin işıqlandırılması        │
└────────────────────────────────────────────────────────┘
```

#### Komponentlər və Fayl İcrası:
1. `server.ts`: Express serveri, `@google/genai` konfiqurasiyası, `/api/synthesize` və `/api/health` marşrutları, audio buferin birləşdirilməsi və axını.
2. `src/lib/azerbaijani-phonetics.ts`: Azərbaycan dilində rəqəmləri, illəri, valyutaları, qısaltmaları tam sözlərə çevirən xüsusi qrammatik mühərrik (məsələn: 1990 -> min doqquz yüz doxsanıncı, 25% -> faizlə iyirmi beş və s.).
3. `src/components/TextWorkspace.tsx`: .txt fayl yükləmə zonası, UTF-8 mətn redaktoru, nümunə ədəbi əsər kitabxanası, fonetik baxış vərəqi.
4. `src/components/StudioPlayer.tsx`: Dərin studiya audio pleyeri, tezlik vizualizatoru, birbaşa WAV/MP3 fayl ixrac düymələri.
5. `src/components/TopNav.tsx`: Top Bar Contract qaydalarına uyğun 3 zonalı təmiz studiya naviqasiyası.
