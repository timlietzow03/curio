# Graph Report - lernscroll  (2026-11-08)

## Corpus Check
- 28 files · ~15,995 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 204 nodes · 372 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a387bf8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- config.ts
- Profile.tsx
- Feed.tsx
- steps
- speech.ts
- Learnscroll (MVP)
- deploy.yml
- GCP Credit & Generation Cost Log (`curio`)
- generate-gcp-videos.mjs
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `Feed()` - 24 edges
2. `base()` - 13 edges
3. `Profile()` - 12 edges
4. `VideoCard()` - 10 edges
5. `speak()` - 9 edges
6. `Check()` - 8 edges
7. `steps` - 8 edges
8. `Clip` - 7 edges
9. `Flame()` - 6 edges
10. `Volume()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Feed()` --calls--> `AdBreak()`  [EXTRACTED]
  src/components/Feed.tsx → src/components/AdBreak.tsx
- `Feed()` --calls--> `Profile()`  [EXTRACTED]
  src/components/Feed.tsx → src/components/Profile.tsx
- `Feed()` --calls--> `VideoCard()`  [EXTRACTED]
  src/components/Feed.tsx → src/components/VideoCard.tsx
- `Feed()` --calls--> `getScenesWithHook()`  [EXTRACTED]
  src/components/Feed.tsx → src/data/hooks.ts
- `Feed()` --calls--> `initVoices()`  [EXTRACTED]
  src/components/Feed.tsx → src/lib/speech.ts

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (32): dependencies, msedge-tts@^2.1.1, next@^16.0.0, react@^19.2.0, react-dom@^19.2.0, devDependencies, @types/node@^22.0.0, @types/react@^19.0.0 (+24 more)

### Community 1 - "config.ts"
Cohesion: 0.14
Nodes (12): AdBreak(), Props, AD_BONUS_POINTS, AD_SECONDS, CHECKIN_POINTS, DAILY_GOAL, DAILY_GOAL_POINTS, POINTS_PER_CORRECT (+4 more)

### Community 2 - "Profile.tsx"
Cohesion: 0.09
Nodes (28): Cross(), formatDuration(), Profile(), Props, Props, TopicPicker(), CLIPS, CLIP_HOOKS (+20 more)

### Community 3 - "Feed.tsx"
Cohesion: 0.20
Nodes (21): day(), EMPTY_METRICS, Feed(), Phase, base(), Bookmark(), Check(), ChevronDown() (+13 more)

### Community 4 - "steps"
Cohesion: 0.09
Nodes (24): runs-on, steps, environment, needs, runs-on, steps, NEXT_PUBLIC_BASE_PATH, STATIC_EXPORT (+16 more)

### Community 5 - "speech.ts"
Cohesion: 0.14
Nodes (22): Props, StageActor(), Props, SceneVisual(), VideoCard(), getScenesWithHook(), blobUrlCache, estimateMs() (+14 more)

### Community 6 - "Learnscroll (MVP)"
Cohesion: 0.40
Nodes (4): curio (MVP), Deploy on Vercel, Run, Where things are

### Community 7 - "deploy.yml"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 9 - "generate-gcp-videos.mjs"
Cohesion: 0.20
Nodes (10): hashText(), humanizeTextForSpeech(), main(), synthesizeToFile(), args, generateViaGeminiApiKey(), generateViaVertexAI(), getAccessToken() (+2 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `package.json` to `config.ts`, `Profile.tsx`, `Feed.tsx`, `speech.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06543385490753911 - nodes in this community are weakly interconnected._
- **Why does `msedge-tts` connect `package.json` to `generate-gcp-videos.mjs`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
- **Should `Profile.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09365079365079365 - nodes in this community are weakly interconnected._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._
- **Should `speech.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._