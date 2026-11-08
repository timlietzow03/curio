import fs from 'node:fs/promises';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const VOICE = 'en-US-AvaMultilingualNeural';

function humanizeTextForSpeech(text) {
  return text
    .replace(/CO₂/g, 'carbon dioxide')
    .replace(/H₂O/g, 'water')
    .replace(/O₂/g, 'oxygen')
    .replace(/C₆H₁₂O₆/g, 'glucose')
    .replace(/a²\s*\+\s*b²\s*=\s*c²/gi, 'a squared plus b squared equals c squared')
    .replace(/²/g, ' squared')
    .replace(/³/g, ' cubed')
    .replace(/√(\d+)/g, 'the square root of $1')
    .replace(/→/g, ' yields ')
    .replace(/\s+—\s+/g, ', ')
    .replace(/\s+–\s+/g, ', ');
}

/** Deterministic FNV-1a 32-bit hex hash so client and build script compute the exact same filename. */
function hashText(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

async function synthesizeToFile(text, outPath) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);
    const chunks = [];
    await new Promise((resolve, reject) => {
      audioStream.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      audioStream.on('end', resolve);
      audioStream.on('close', resolve);
      audioStream.on('error', reject);
    });
    const buf = Buffer.concat(chunks);
    if (buf.length === 0) throw new Error('Empty audio stream');
    await fs.writeFile(outPath, buf);
    return buf.length;
  } finally {
    try {
      tts.close();
    } catch {}
  }
}

async function main() {
  const clipsPath = path.join(process.cwd(), 'src', 'data', 'clips.ts');
  const clipsSource = await fs.readFile(clipsPath, 'utf8');

  // Extract all `say: '...'` or `say: "..."` strings from clips.ts
  const regex = /say:\s*(['"])((?:\\.|(?!\1).)*)\1/g;
  const phrases = new Set();
  let match;
  while ((match = regex.exec(clipsSource)) !== null) {
    const raw = match[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
    phrases.add(raw);
  }
  // Also include the voice preview sentence
  phrases.add('Welcome to curio! Let’s learn something new today.');

  const outDir = path.join(process.cwd(), 'public', 'audio');
  await fs.mkdir(outDir, { recursive: true });

  const list = Array.from(phrases);
  console.log(`Generating ${list.length} neural audio clips into public/audio/...`);

  let generated = 0;
  let skipped = 0;

  // Process in small batches of 4 for speed and reliability
  const concurrency = 4;
  for (let i = 0; i < list.length; i += concurrency) {
    const batch = list.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (rawText) => {
        const cleaned = humanizeTextForSpeech(rawText.trim());
        const hash = hashText(cleaned);
        const filePath = path.join(outDir, `${hash}.mp3`);
        try {
          const stat = await fs.stat(filePath);
          if (stat.size > 500) {
            skipped++;
            return;
          }
        } catch {}
        await synthesizeToFile(cleaned, filePath);
        generated++;
      }),
    );
    process.stdout.write(`\rProgress: ${Math.min(i + concurrency, list.length)}/${list.length}`);
  }

  console.log(`\nDone! Generated: ${generated}, cached: ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
