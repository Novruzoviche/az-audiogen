import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeAzerbaijaniForSpeech } from './src/lib/azerbaijani-phonetics.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Birdən çox WAV buferini təmiz və qüsursuz şəkildə birləşdirir.
 * RIFF başlıqlarını (44 bayt) tənzimləyir və ümumi PCM ölçüsünü yeniləyir.
 */
function stitchWavBuffers(wavBuffers: Buffer[]): Buffer {
  if (wavBuffers.length === 0) return Buffer.alloc(0);
  if (wavBuffers.length === 1) return wavBuffers[0];

  const pcmList: Buffer[] = [];
  let totalPcmLength = 0;

  for (const buf of wavBuffers) {
    if (buf.length > 44) {
      // 44-cü baytdan sonrakı təmiz PCM məlumatları
      const pcm = buf.subarray(44);
      pcmList.push(pcm);
      totalPcmLength += pcm.length;
    }
  }

  // İlk buferin başlığını kopyalayırıq
  const header = Buffer.from(wavBuffers[0].subarray(0, 44));

  // Offset 4: ChunkSize (Fayl ölçüsü - 8)
  header.writeUInt32LE(totalPcmLength + 36, 4);
  // Offset 40: Subchunk2Size (PCM baytlarının cəmi)
  header.writeUInt32LE(totalPcmLength, 40);

  return Buffer.concat([header, ...pcmList]);
}

/**
 * Uzun mətni təbii abzaslar və cümlələr üzrə optimal hissələrə bölür
 */
function chunkTextForSpeech(text: string, maxWordsPerChunk = 120): string[] {
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/).filter(Boolean);

    if (paraWords.length > maxWordsPerChunk) {
      // Əgər abzas çox uzundursa, cümlələrə böl
      const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para];
      for (const sent of sentences) {
        const sentWords = sent.split(/\s+/).filter(Boolean).length;
        if (currentWordCount + sentWords > maxWordsPerChunk && currentChunk.length > 0) {
          chunks.push(currentChunk.join(' '));
          currentChunk = [];
          currentWordCount = 0;
        }
        currentChunk.push(sent.trim());
        currentWordCount += sentWords;
      }
    } else {
      if (currentWordCount + paraWords.length > maxWordsPerChunk && currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'));
        currentChunk = [];
        currentWordCount = 0;
      }
      currentChunk.push(para);
      currentWordCount += paraWords.length;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks.length > 0 ? chunks : [text];
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Səda Azerbaijani Speech Engine',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// Səs Sintezi API Marşrutu
app.post('/api/synthesize', async (req, res) => {
  try {
    const {
      text,
      voiceName = 'Fenrir', // Dərin və təmkinli kişi səsi üçün 'Fenrir' / 'Charon'
      speechStyle = 'Sakit, dərin, təmkinli, emosional və dinləyicini yormayan peşəkar Azərbaycan ədəbi hekayə və roman diktoru səsi. Ədəbi orfoepiyaya və pauzalara qüsursuz əməl et.',
      autoNormalize = true,
    } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Mətn daxil edilməyib.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY mühit parametri tapılmadı. Zəhmət olmasa konfiqurasiyanı yoxlayın.',
      });
    }

    // 1. Fonetik və orfoepiya normalizasiyası (Sıfır itki ilə)
    const normalizedData = autoNormalize ? normalizeAzerbaijaniForSpeech(text) : { normalized: text, stats: { originalWords: 0, originalChars: 0, sentences: 0, estimatedSeconds: 0 } };
    const speechReadyText = normalizedData.normalized;

    // 2. Mətni optimal bloklara bölmək
    const chunks = chunkTextForSpeech(speechReadyText, 140);
    const audioBuffers: Buffer[] = [];

    // 3. Hər bir bloku Gemini 3.8 Flash TTS ilə sintez etmək
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk.trim()) continue;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: chunk,
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || 'Fenrir',
              },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        audioBuffers.push(Buffer.from(base64Audio, 'base64'));
      }
    }

    if (audioBuffers.length === 0) {
      throw new Error('Səs generasiyası zamanı audio axını əldə edilmədi.');
    }

    // 4. Bütün parçaları birləşdirərək bütöv WAV faylı əldə etmək
    const completeWavBuffer = stitchWavBuffers(audioBuffers);
    const completeBase64 = completeWavBuffer.toString('base64');

    // Təxmini audio müddəti (24kHz 16-bit mono = 48,000 bayt/saniyə)
    const pcmByteCount = Math.max(0, completeWavBuffer.length - 44);
    const exactDurationSeconds = parseFloat((pcmByteCount / 48000).toFixed(2));

    return res.json({
      success: true,
      audioBase64: completeBase64,
      mimeType: 'audio/wav',
      sampleRate: 24000,
      duration: exactDurationSeconds,
      normalizedText: speechReadyText,
      chunksCount: chunks.length,
      voice: voiceName,
    });
  } catch (error: any) {
    console.error('Səs sintezi xətası:', error);
    return res.status(500).json({
      error: error?.message || 'Səs sintezi zamanı daxili xəta baş verdi.',
    });
  }
});

// Vite middleware və ya statik faylların verilməsi
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Səda Audio Engine server işləyir: http://localhost:${PORT}`);
  });
}

setupServer();
