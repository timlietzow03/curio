/**
 * Google AI Studio / Vertex AI Video Generator (Veo 2) for curio.
 *
 * Supports TWO easy ways to use your 53.94 EUR GCP credits:
 *
 * 1) Via AI Studio / Gemini API Key (Easiest!):
 *    node scripts/generate-gcp-videos.mjs --key=AIzaSy...
 *
 * 2) Via Vertex AI Project ID + Access Token:
 *    node scripts/generate-gcp-videos.mjs --project=YOUR_PROJECT_ID --token=ya29...
 *
 * Options:
 *   --vibe=makeup|sport|podcast|stickman   (default: generates all 4 core vibe 8s loops)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const idx = a.indexOf('=');
    if (idx === -1) return [a.replace(/^--/, ''), 'true'];
    return [a.slice(0, idx).replace(/^--/, ''), a.slice(idx + 1)];
  }),
);

const API_KEY = args.key || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const PROJECT_ID = args.project || process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = args.location || process.env.GCP_LOCATION || 'us-central1';
const MODEL = args.model || 'veo-3.1-fast-generate-001';

const VIBE_PROMPTS = {
  makeup:
    'Vertical 9:16 aesthetic Get Ready With Me (GRWM) vlog background, warm vanity mirror ring light reflections, soft bokeh bedroom studio, subtle movement of makeup brushes and glowing aesthetic lighting, cinematic 4k, no text',
  sport:
    'Vertical 9:16 cinematic gym and athletic training atmosphere, dramatic moody neon rim lighting, slow motion chalk dust particles in the air, modern fitness studio background loop, high contrast, 4k, no text',
  podcast:
    'Vertical 9:16 cozy late-night creator podcast studio, studio boom microphone in foreground bokeh, warm tungsten LED tube lights, dark acoustic foam wall background, subtle camera drift, cinematic 4k, no text',
  stickman:
    'Vertical 9:16 minimal dark blueprint chalkboard background with subtle glowing geometric grid lines and floating math particles, deep navy blue aesthetic, clean educational explainer backdrop, 4k, no text',
};

function getAccessToken() {
  if (args.token || process.env.GCP_ACCESS_TOKEN) {
    return (args.token || process.env.GCP_ACCESS_TOKEN).trim();
  }
  try {
    return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch {
    throw new Error(
      'Missing credentials. Either pass --key=AIzaSy... (from aistudio.google.com/apikey) OR --project=ID --token=TOKEN.',
    );
  }
}

async function generateViaGeminiApiKey(prompt, apiKey, outPath) {
  const startUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${apiKey}`;
  const res = await fetch(startUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        aspectRatio: '9:16',
        sampleCount: 1,
        durationSeconds: 8,
        personGeneration: 'allow_adult',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Veo error (${res.status}): ${errText}`);
  }

  const op = await res.json();
  console.log(`Operation started: ${op.name}`);

  for (let attempt = 1; attempt <= 60; attempt++) {
    await new Promise((r) => setTimeout(r, 5000));
    process.stdout.write(`\rPolling Veo operation (attempt ${attempt}/60)...`);

    const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${op.name}?key=${apiKey}`);
    if (!pollRes.ok) {
      const errText = await pollRes.text();
      throw new Error(`Poll error (${pollRes.status}): ${errText}`);
    }

    const data = await pollRes.json();
    if (data.done) {
      console.log('\nOperation completed!');
      if (data.error) throw new Error(`Veo error: ${JSON.stringify(data.error)}`);

      const samples =
        data.response?.generateVideoResponse?.generatedSamples ||
        data.response?.videos ||
        data.response?.predictions ||
        [];
      const first = samples[0];
      const videoUri = first?.video?.uri;
      const b64 = first?.bytesBase64Encoded || first?.video?.bytesBase64Encoded;

      if (b64) {
        await fs.writeFile(outPath, Buffer.from(b64, 'base64'));
        return;
      }
      if (videoUri) {
        const dlUrl = videoUri.includes('?') ? `${videoUri}&key=${apiKey}` : `${videoUri}?key=${apiKey}`;
        const dlRes = await fetch(dlUrl);
        if (!dlRes.ok) throw new Error(`Failed to download video from URI (${dlRes.status})`);
        const buf = Buffer.from(await dlRes.arrayBuffer());
        await fs.writeFile(outPath, buf);
        return;
      }
      throw new Error(`Unexpected Veo response structure: ${JSON.stringify(data.response).slice(0, 400)}`);
    }
  }
  throw new Error('Timed out waiting for Veo video generation.');
}

async function generateViaVertexAI(prompt, token, outPath) {
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predictLongRunning`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        aspectRatio: '9:16',
        sampleCount: 1,
        durationSeconds: 8,
        personGeneration: 'allow_adult',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Vertex AI Veo error (${res.status}): ${errText}`);
  }
  const op = await res.json();
  console.log(`Operation started: ${op.name}`);

  const pollUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:fetchPredictOperation`;

  for (let attempt = 1; attempt <= 60; attempt++) {
    await new Promise((r) => setTimeout(r, 5000));
    process.stdout.write(`\rPolling Vertex AI operation (attempt ${attempt}/60)...`);

    const pollRes = await fetch(pollUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operationName: op.name }),
    });

    if (!pollRes.ok) {
      const errText = await pollRes.text();
      throw new Error(`Poll error (${pollRes.status}): ${errText}`);
    }

    const data = await pollRes.json();
    if (data.done) {
      console.log('\nOperation completed!');
      if (data.error) throw new Error(`Veo generation failed: ${JSON.stringify(data.error)}`);
      const videos = data.response?.videos || data.response?.predictions || [];
      const first = videos[0];
      const b64 = first?.bytesBase64Encoded || first?.video?.bytesBase64Encoded;
      if (!b64) throw new Error(`No base64 video in Vertex response: ${JSON.stringify(data.response).slice(0, 400)}`);
      await fs.writeFile(outPath, Buffer.from(b64, 'base64'));
      return;
    }
  }
  throw new Error('Timed out waiting for Vertex AI Veo generation.');
}

async function main() {
  if (!API_KEY && !PROJECT_ID) {
    console.log(`
Usage (Option A - Gemini API Key from aistudio.google.com/apikey):
  node scripts/generate-gcp-videos.mjs --key=AIzaSy... [--vibe=makeup|sport|podcast|stickman]

Usage (Option B - Vertex AI Project + Token):
  node scripts/generate-gcp-videos.mjs --project=YOUR_GCP_PROJECT_ID --token=YOUR_ACCESS_TOKEN [--vibe=makeup]
`);
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outDir, { recursive: true });

  const selectedVibes = args.vibe ? [args.vibe] : Object.keys(VIBE_PROMPTS);

  for (const vibe of selectedVibes) {
    const prompt = args.prompt || VIBE_PROMPTS[vibe];
    if (!prompt) {
      console.error(`Unknown vibe "${vibe}". Choose from: ${Object.keys(VIBE_PROMPTS).join(', ')}`);
      continue;
    }

    const outPath = path.join(outDir, `vibe-${vibe}.mp4`);
    console.log(`\nStarting Veo (${MODEL}) 9:16 8s video generation for vibe: [${vibe}]...`);

    if (API_KEY) {
      await generateViaGeminiApiKey(prompt, API_KEY, outPath);
    } else {
      const token = getAccessToken();
      await generateViaVertexAI(prompt, token, outPath);
    }
    console.log(`Saved ${outPath}!`);
  }
}

main().catch((err) => {
  console.error('\nError:', err.message || err);
  process.exit(1);
});
