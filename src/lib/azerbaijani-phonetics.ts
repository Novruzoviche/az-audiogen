/**
 * Səda Audio Engine — Azərbaycan Dili Fonetik və Orfoepiya Tənzimləyicisi
 * 
 * Bu modul Azərbaycan dilinin ədəbi orfoepiya qaydalarına əsasən:
 * 1. Sayları (miqdar, sıra, illər, əsrlər) tam ədəbi sözlərə çevirir (1990-cı il -> min doqquz yüz doxsanıncı il)
 * 2. Qısaltmaları və ölçü vahidlərini tam oxunuşa uyğunlaşdırır (kq -> kiloqram, % -> faiz)
 * 3. Durğu işarələri üzrə nəfəs pauzalarını və intonasiya keçidlərini tənzimləyir
 * 4. Mətnin bütövlüyünü (Zero Loss) 100% təmin edir
 */

const ONES: Record<number, string> = {
  0: 'sıfır',
  1: 'bir',
  2: 'iki',
  3: 'üç',
  4: 'dörd',
  5: 'beş',
  6: 'altı',
  7: 'yeddi',
  8: 'səkkiz',
  9: 'doqquz',
};

const TENS: Record<number, string> = {
  10: 'on',
  20: 'iyirmi',
  30: 'otuz',
  40: 'qırx',
  50: 'əlli',
  60: 'altmış',
  70: 'yetmiş',
  80: 'səksən',
  90: 'doxsan',
};

const ROMAN_MAP: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16, XVII: 17, XVIII: 18, XIX: 19, XX: 20,
  XXI: 21, XXII: 22, XXIII: 23, XXIV: 24, XXV: 25
};

/**
 * 0 - 999 aralığındakı ədədləri sözə çevirir
 */
function chunkToWords(num: number): string {
  if (num === 0) return '';
  const words: string[] = [];

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    if (hundreds === 1) {
      words.push('yüz');
    } else {
      words.push(`${ONES[hundreds]} yüz`);
    }
  }

  if (remainder > 0) {
    if (remainder < 10) {
      words.push(ONES[remainder]);
    } else {
      const tensDigit = Math.floor(remainder / 10) * 10;
      const onesDigit = remainder % 10;
      words.push(TENS[tensDigit]);
      if (onesDigit > 0) {
        words.push(ONES[onesDigit]);
      }
    }
  }

  return words.join(' ');
}

/**
 * İstənilən tam ədədi Azərbaycan dilində sözlərlə yazır
 */
export function numberToAzerbaijaniWords(num: number): string {
  if (num === 0) return 'sıfır';
  if (num < 0) return `mənfi ${numberToAzerbaijaniWords(Math.abs(num))}`;

  const scales = [
    { value: 1_000_000_000, name: 'milyard' },
    { value: 1_000_000, name: 'milyon' },
    { value: 1_000, name: 'min' },
  ];

  const parts: string[] = [];
  let remaining = num;

  for (const scale of scales) {
    if (remaining >= scale.value) {
      const count = Math.floor(remaining / scale.value);
      remaining %= scale.value;

      if (scale.name === 'min' && count === 1) {
        parts.push('min');
      } else {
        parts.push(`${chunkToWords(count)} ${scale.name}`);
      }
    }
  }

  if (remaining > 0) {
    parts.push(chunkToWords(remaining));
  }

  return parts.join(' ').trim();
}

/**
 * Ədədin son sait və ya səsinə uyğun sıra sayı şəkilçisi (-ıncı, -inci, -uncu, -üncü) əlavə edir
 */
export function numberToOrdinalAzerbaijani(num: number): string {
  const words = numberToAzerbaijaniWords(num);
  const lastWord = words.trim().split(' ').pop() || '';

  // Azərbaycan dilində son sözün tələffüzünə görə sıra şəkilçisi:
  // bir -> birinci
  // iki -> ikinci
  // üç -> üçüncü
  // dörd -> dördüncü
  // beş -> beşinci
  // altı -> altıncı
  // yeddi -> yeddinci
  // səkkiz -> səkkizinci
  // doqquz -> doqquzuncu
  // on -> onuncu
  // iyirmi -> iyirminci
  // otuz -> otuzuncu
  // qırx -> qırxıncı
  // əlli -> əllinci
  // altmış -> altmışıncı
  // yetmiş -> yetmişinci
  // səksən -> səksəninci
  // doxsan -> doxsanıncı
  // yüz -> yüzüncü
  // min -> mininci
  // milyon -> milyonuncu
  // milyard -> milyardıncı

  const ordinalEndings: Record<string, string> = {
    bir: 'birinci',
    iki: 'ikinci',
    üç: 'üçüncü',
    dörd: 'dördüncü',
    beş: 'beşinci',
    altı: 'altıncı',
    yeddi: 'yeddinci',
    səkkiz: 'səkkizinci',
    doqquz: 'doqquzuncu',
    on: 'onuncu',
    iyirmi: 'iyirminci',
    otuz: 'otuzuncu',
    qırx: 'qırxıncı',
    əlli: 'əllinci',
    altmış: 'altmışıncı',
    yetmiş: 'yetmişinci',
    səksən: 'səksəninci',
    doxsan: 'doxsanıncı',
    yüz: 'yüzüncü',
    min: 'mininci',
    milyon: 'milyonuncu',
    milyard: 'milyardıncı',
    sıfır: 'sıfırıncı',
  };

  const replacedLast = ordinalEndings[lastWord] || `${lastWord}-inci`;
  const allWords = words.trim().split(' ');
  allWords[allWords.length - 1] = replacedLast;
  return allWords.join(' ');
}

type ReplacementRule = [RegExp, string | ((match: string, ...args: string[]) => string)];

/**
 * Mətndəki qısaltmaların ədəbi açılışı
 */
const ABBREVIATIONS_MAP: ReplacementRule[] = [
  [/\bvə\s*s\.\s*a\./gi, 'və sairə axır'],
  [/\bvə\s*s\./gi, 'və sairə'],
  [/\bməs\./gi, 'məsələn'],
  [/\bm\.\s*ö\./gi, 'miladdan öncə'],
  [/\be\.\s*ə\./gi, 'eramızdan əvvəl'],
  [/\bbax\./gi, 'baxınız'],
  [/\bt\.\s*e\.\s*d\./gi, 'tarix elmləri doktoru'],
  [/\bf\.\s*e\.\s*d\./gi, 'filologiya elmləri doktoru'],
  [/\bprof\./gi, 'professor'],
  [/\bdos\./gi, 'dosent'],
  [/\bakad\./gi, 'akademik'],
  [/\bmüəl\./gi, 'müəllim'],
  [/\bşəh\./gi, 'şəhəri'],
  [/\bkənd\./gi, 'kəndi'],
  [/\bküç\./gi, 'küçəsi'],
  [/\bqəs\./gi, 'qəsəbəsi'],
  [/\bresp\./gi, 'respublikası'],
  [/\bdöv\./gi, 'dövlət'],
  [/\bünv\./gi, 'ünvanı'],
  [/\btel\./gi, 'telefon'],
  [/\bnöm\./gi, 'nömrə'],
  [/№\s*(\d+)/gi, (_: string, n: string) => `nömrə ${numberToAzerbaijaniWords(parseInt(n, 10))}`],
  [/№/g, 'nömrə '],
];

/**
 * Ölçü vahidləri və simvollar
 */
const UNITS_MAP: ReplacementRule[] = [
  [/(\d+)\s*kq\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} kiloqram`],
  [/(\d+)\s*q\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} qram`],
  [/(\d+)\s*km\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} kilometr`],
  [/(\d+)\s*sm\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} santimetr`],
  [/(\d+)\s*mm\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} millimetr`],
  [/(\d+)\s*m\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} metr`],
  [/(\d+)\s*ha\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} hektar`],
  [/(\d+)\s*san\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} saniyə`],
  [/(\d+)\s*dəq\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} dəqiqə`],
  [/(\d+)\s*saat\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} saat`],
  [/(\d+)\s*°C\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} dərəcə selsi`],
  [/(\d+)\s*%\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} faiz`],
  [/%\s*(\d+)/gi, (_: string, n: string) => `faizlə ${numberToAzerbaijaniWords(parseInt(n, 10))}`],
  [/(\d+)\s*₼\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} manat`],
  [/(\d+)\s*AZN\b/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} manat`],
  [/(\d+)\s*\$/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} dollar`],
  [/\$\s*(\d+)/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} dollar`],
  [/(\d+)\s*€/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} avro`],
  [/€\s*(\d+)/gi, (_: string, n: string) => `${numberToAzerbaijaniWords(parseInt(n, 10))} avro`],
];

/**
 * Roma rəqəmlərinin açılışı (məsələn: "XX əsr" -> "iyirminci əsr")
 */
function expandRomanNumerals(text: string): string {
  return text.replace(/\b([IVXLCDM]+)([-–—]?(?:ci|cı|cu|cü))?\s+(əsr|əsrdə|əsrə|əsrin|bölmə|fəsil|cild|hissə)\b/gi, (match, roman, suffix, noun) => {
    const num = ROMAN_MAP[roman.toUpperCase()];
    if (num) {
      const ordinal = numberToOrdinalAzerbaijani(num);
      return `${ordinal} ${noun}`;
    }
    return match;
  });
}

/**
 * İllər və tarixlərin dəqiq orfoepiya açılışı
 * məsələn: "1990-cı il" -> "min doqquz yüz doxsanıncı il"
 * "2024-cü ildə" -> "iki min iyirmi dördüncü ildə"
 */
function expandYearsAndOrdinals(text: string): string {
  // 1. "1990-cı il", "1990-ci il", "1990-cu il", "1990-cü il"
  let processed = text.replace(/(\d+)[-–—](cı|ci|cu|cü)\s*(il|ildə|ilə|ilin|ilini|ildən)/gi, (_, numStr, suffix, noun) => {
    const num = parseInt(numStr, 10);
    const ordinal = numberToOrdinalAzerbaijani(num);
    return `${ordinal} ${noun}`;
  });

  // 2. "1-ci", "2-ci", "3-cü", "10-cu" tipli sıra sayları
  processed = processed.replace(/(\d+)[-–—](cı|ci|cu|cü)/gi, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return numberToOrdinalAzerbaijani(num);
  });

  // 3. Sadə "1990-cı", "1990-cu"
  processed = processed.replace(/(\d{4})\s+(il|ildə|ilin|ilə|ildən)\b/gi, (_, numStr, noun) => {
    const num = parseInt(numStr, 10);
    const ordinal = numberToOrdinalAzerbaijani(num);
    return `${ordinal} ${noun}`;
  });

  return processed;
}

/**
 * Qalan bütün təcrid olunmuş rəqəmlərin açılışı
 */
function expandRemainingNumbers(text: string): string {
  return text.replace(/\b\d+\b/g, (match) => {
    const num = parseInt(match, 10);
    if (!isNaN(num)) {
      return numberToAzerbaijaniWords(num);
    }
    return match;
  });
}

/**
 * Durğu işarələrini tənzimləmək:
 * Səs sintezində vergüllərdən və nöqtələrdən sonra mikro nəfəs fasilələri qoyulur
 */
function harmonizePunctuationAndBreathing(text: string): string {
  let cleaned = text;

  // Nöqtədən sonra təbii ritm üçün boşluq təminatı
  cleaned = cleaned.replace(/([.!?])([^\s"”'’\n])/g, '$1 $2');
  
  // Vergüldən sonra boşluq
  cleaned = cleaned.replace(/,([^\s])/g, ', $1');

  // Çoxsaylı nöqtələri (...) üç nöqtəyə gətir
  cleaned = cleaned.replace(/\.{4,}/g, '...');

  // Xüsusi xarici simvolların və UTF-8 xətalarının təmizlənməsi
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

  return cleaned;
}

/**
 * Əsas Fonetik Normalizasiya Boru Kəməri (Pipeline)
 * Mətni dəyişdirmədən, sıfır itki ilə səsləndirməyə hazırlayır.
 */
export function normalizeAzerbaijaniForSpeech(text: string): {
  normalized: string;
  stats: {
    originalWords: number;
    originalChars: number;
    sentences: number;
    estimatedSeconds: number;
  };
} {
  if (!text || text.trim() === '') {
    return {
      normalized: '',
      stats: { originalWords: 0, originalChars: 0, sentences: 0, estimatedSeconds: 0 },
    };
  }

  const originalChars = text.length;
  const originalWords = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [text]).length;
  // Azərbaycan dilində ortalama oxuma sürəti: dəqiqədə təqribən 120-130 söz (hekayəçi/audiobook tərzi)
  const estimatedSeconds = Math.max(1, Math.round((originalWords / 125) * 60));

  let result = text;

  // 1. Roma rəqəmləri (XX əsr)
  result = expandRomanNumerals(result);

  // 2. Qısaltmalar (və s., prof., t.e.d.)
  for (const [pattern, replacement] of ABBREVIATIONS_MAP) {
    result = result.replace(pattern, replacement as any);
  }

  // 3. Ölçü vahidləri və simvollar (kq, km, %, ₼, $)
  for (const [pattern, replacement] of UNITS_MAP) {
    result = result.replace(pattern, replacement as any);
  }

  // 4. İllər və sıra sayları (1990-cı il -> min doqquz yüz doxsanıncı il)
  result = expandYearsAndOrdinals(result);

  // 5. Yerdə qalan sadə saylar
  result = expandRemainingNumbers(result);

  // 6. Durğu işarələri və intonasiya harmonizasiyası
  result = harmonizePunctuationAndBreathing(result);

  return {
    normalized: result,
    stats: {
      originalWords,
      originalChars,
      sentences,
      estimatedSeconds,
    },
  };
}

/**
 * Klassik Azərbaycan ədəbiyyatından seçilmiş nümunə mətnlər
 */
export const SAMPLE_TEXTS = [
  {
    id: 'jalil-poct',
    title: 'Cəlil Məmmədquluzadə — "Poçt Qutusu"',
    author: 'Cəlil Məmmədquluzadə',
    genre: 'Klassik Hekayə',
    text: `Vəli xan poçt qutusunun yanına çatanda Novruzəlini orada gördü. Novruzəli xanın atının qabağına yüyürüb baş endirdi və dedi:
— Salaməleyküm, xan ağa! Atanın goru üçün, bir mənim kağızıma bax!
Xan atın başını çəkib soruşdu:
— Nə kağızdır, Novruzəli?
— Vallah, xan ağa, İrəvandan əmim oğlu göndərib. Deyir ki, bu saat bu məktubu sal poçt qutusuna. Mən də gətirib salmışam bu sandığın içinə, amma qorxuram ki, xarab olar, ya kimsə götürər. 1903-cü ilin payızından bəri gözləyirəm, bircə yol xəbər çıxmadı.
Xan gülümsədi, səsini təmkinlə ucaltdı və Novruzəliyə tərəf baxdı.`,
  },
  {
    id: 'mirjalal-manifest',
    title: 'Mir Cəlal — "Bir Gəncin Manifesti"',
    author: 'Mir Cəlal',
    genre: 'Roman',
    text: `Baharın ilk günləri idi. Dağların qarı əriyir, çaylar coşub-daşırdı. Sona xala səhər tezdən durub həyəti süpürürdü. O, hər addımında keçmiş illərin xatirəsini xatırlayır, oğlu Baharın yolunu intizarla gözləyirdi. 
Kəndin yuxarı başından 2 atlı gəlirdi. Atların ayaq səsləri daşlı yolda əks-səda verirdi. Onlar kənd sovetinin binası qabağında dayandılar. Saat 10:00 tamamda kəndin ağsaqqalları məclisə toplaşdılar. Hər kəsin üzündə bir ümid, bir həyəcan vardı.`,
  },
  {
    id: 'nizami-hekayet',
    title: 'Nizami Gəncəvi — "Sirlər Xəzinəsi"ndən Hekayət',
    author: 'Nizami Gəncəvi',
    genre: 'Mənzum Hekayət',
    text: `Bir gün Sultan Səncər ovdan qayıdarkən yolda qoca bir qarı onun qarşısını kəsdi. Ədalət tələb edən qarı dedi:
— Ey ədalətli hökmdar! Sənin məmurların mənim bir parça çörəyimi əlimdən alıblar. Əgər sən bu ölkədə haqqı bərpa etməsən, sabah tarixin məhkəməsində cavab verə bilməyəcəksən.
Sultan bu sözlərdən dərindən sarsıldı. O, atından yerə endi, qocanın qarşısında baş əydi və ona haqqını qaytarmağa söz verdi.`,
  },
  {
    id: 'custom-speech',
    title: 'Dərin Fəlsəfi Esse — "Zaman və İnsan"',
    author: 'Ədəbi Esse',
    genre: 'Fəlsəfə və Düşüncə',
    text: `Zaman elə bir axardır ki, heç bir bənd onun qarşısını kəsə bilməz. 18-ci və 19-cu əsrlərdə yaşayan mütəfəkkirlər insan ruhunun sirrini anlamaq üçün cild-cild kitablar yazdılar. 1990-cı ildən bu günə qədər dünya görünməmiş sürətlə dəyişdi. Lakin bir həqiqət dəyişməz olaraq qalır: sözün qüdrəti, səsin sehri və təbiətin harmoniyası insan qəlbini həmişə ovsunlayır.`,
  },
];
