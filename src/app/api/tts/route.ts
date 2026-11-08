import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const runtime = 'nodejs';

const ALLOWED_VOICES = new Set([
  'en-US-AvaMultilingualNeural',
  'en-US-AndrewMultilingualNeural',
  'en-US-EmmaMultilingualNeural',
  'en-US-BrianMultilingualNeural',
  'en-GB-SoniaNeural',
  'en-GB-RyanNeural',
]);

const DEFAULT_VOICE = 'en-US-AvaMultilingualNeural';

// In-memory LRU cache so repeated lessons and loops play with 0ms latency
const audioCache = new Map<string, Uint8Array>();
const MAX_CACHE_ITEMS = 120;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawText = (searchParams.get('text') || '').trim();
  const requestedVoice = searchParams.get('voice') || DEFAULT_VOICE;
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : DEFAULT_VOICE;

  if (!rawText || rawText.length > 600) {
    return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
  }

  const cacheKey = `${voice}::${rawText}`;
  const cached = audioCache.get(cacheKey);
  if (cached) {
    return new NextResponse(Buffer.from(cached), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  }

  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(rawText);
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      audioStream.on('data', (chunk: Buffer) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      audioStream.on('end', () => resolve());
      audioStream.on('close', () => resolve());
      audioStream.on('error', (err: Error) => reject(err));
    });

    const buf = Buffer.concat(chunks);
    if (buf.length === 0) {
      throw new Error('Empty audio stream');
    }

    const bytes = new Uint8Array(buf);
    if (audioCache.size >= MAX_CACHE_ITEMS) {
      const oldest = audioCache.keys().next().value;
      if (oldest) audioCache.delete(oldest);
    }
    audioCache.set(cacheKey, bytes);

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'TTS failed', detail: String(err) }, { status: 500 });
  } finally {
    try {
      tts.close();
    } catch {}
  }
}
