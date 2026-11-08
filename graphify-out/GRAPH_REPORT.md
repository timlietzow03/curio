# Graph Report - lernscroll  (2026-11-08)

## Corpus Check
- 24 files · ~10,424 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 167 nodes · 290 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- config.ts
- types.ts
- Profile.tsx
- steps
- speech.ts
- Learnscroll (MVP)
- deploy.yml
- layout.tsx
- generate-audio.mjs
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `Feed()` - 18 edges
2. `Profile()` - 11 edges
3. `base()` - 10 edges
4. `speak()` - 9 edges
5. `VideoCard()` - 9 edges
6. `steps` - 8 edges
7. `Check()` - 8 edges
8. `react` - 6 edges
9. `preloadSpeech()` - 6 edges
10. `Flame()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Feed()` --calls--> `AdBreak()`  [EXTRACTED]
  src/components/Feed.tsx → src/components/AdBreak.tsx
- `Feed()` --calls--> `speechSupported()`  [EXTRACTED]
  src/components/Feed.tsx → src/lib/speech.ts
- `Feed()` --calls--> `initVoices()`  [EXTRACTED]
  src/components/Feed.tsx → src/lib/speech.ts
- `Profile()` --calls--> `getEnglishVoices()`  [EXTRACTED]
  src/components/Profile.tsx → src/lib/speech.ts
- `Profile()` --calls--> `subscribeVoices()`  [EXTRACTED]
  src/components/Profile.tsx → src/lib/speech.ts

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.08
Nodes (29): dependencies, msedge-tts@^2.1.1, next@^16.0.0, react@^19.2.0, react-dom@^19.2.0, devDependencies, @types/node@^22.0.0, @types/react@^19.0.0 (+21 more)

### Community 1 - "config.ts"
Cohesion: 0.14
Nodes (12): AdBreak(), Props, AD_BONUS_POINTS, AD_SECONDS, CHECKIN_POINTS, DAILY_GOAL, DAILY_GOAL_POINTS, POINTS_PER_CORRECT (+4 more)

### Community 2 - "types.ts"
Cohesion: 0.18
Nodes (12): formatDuration(), Props, getEnglishVoices(), subscribeVoices(), VoiceOption, Ad, Clip, Metrics (+4 more)

### Community 3 - "Profile.tsx"
Cohesion: 0.17
Nodes (18): day(), EMPTY_METRICS, Feed(), Phase, base(), Bookmark(), Check(), ChevronDown() (+10 more)

### Community 4 - "steps"
Cohesion: 0.09
Nodes (24): runs-on, steps, environment, needs, runs-on, steps, NEXT_PUBLIC_BASE_PATH, STATIC_EXPORT (+16 more)

### Community 5 - "speech.ts"
Cohesion: 0.19
Nodes (18): Props, SceneVisual(), VideoCard(), blobUrlCache, estimateMs(), fetchNeuralAudioUrl(), getAudioElement(), hashText() (+10 more)

### Community 6 - "Learnscroll (MVP)"
Cohesion: 0.40
Nodes (4): curio (MVP), Deploy on Vercel, Run, Where things are

### Community 7 - "deploy.yml"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 9 - "generate-audio.mjs"
Cohesion: 0.43
Nodes (4): hashText(), humanizeTextForSpeech(), main(), synthesizeToFile()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `package.json` to `config.ts`, `types.ts`, `Profile.tsx`, `speech.ts`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08064516129032258 - nodes in this community are weakly interconnected._
- **Why does `msedge-tts` connect `package.json` to `generate-audio.mjs`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
- **Why does `next` connect `package.json` to `layout.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._