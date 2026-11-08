# curio (MVP)

Scrollable learning videos with a pop quiz every round and an ad break. Mock data only, no backend.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Add `?round=3` to the URL to get the quiz after 3 videos (default: 10).

## Deploy on Vercel

```bash
npx vercel
```

No environment variables needed.

## Where things are

- `src/data/clips.ts` – the mock lessons (narrated scenes + one quiz question each)
- `src/data/ads.ts` – mock sponsors
- `src/lib/config.ts` – round size, points, daily goal, ad length
- `src/lib/speech.ts` – neural/natural voice ranking, symbol normalization & conversational speech pacing
- `src/components/VideoCard.tsx` – player. A clip with `videoUrl` plays that file; otherwise it plays a generated lesson with browser text-to-speech
- `src/components/AdBreak.tsx` – round ad breaks and rewarded "Streak Saver" ads
- `src/components/Profile.tsx` – progress, daily goal, voice selector, and validation metrics
- `graphify-out/` – Graphify codebase knowledge graph (`graph.json`, `graph.html`, `GRAPH_REPORT.md`). Update after code changes via `graphify update .`

Progress (points, streak, daily goal, voice preference, validation metrics, saved clips) is kept in the browser's localStorage.
