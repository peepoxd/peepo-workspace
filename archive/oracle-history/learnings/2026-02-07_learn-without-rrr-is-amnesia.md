# Learn Without RRR = Productive Amnesia

**Date**: 2026-02-07
**Context**: Auditing 14 learned repos, discovering none were used
**Confidence**: High

## Key Learning

`/learn` without `/rrr` creates "productive amnesia" — the feeling of learning without any knowledge actually persisting across sessions. The Distillation Pyramid (6 layers from raw data to CLAUDE.md) only works when `/rrr` pumps knowledge through the pipeline.

Evidence: 14 repos learned between Jan 29 - Feb 7. Only 2-4 ever referenced again. The rest produced 50+ markdown files that sit unread in `ψ/learn/`.

The critical insight is that **MEMORY.md is the only auto-loaded file** across sessions. Everything else requires explicit action to access. If knowledge doesn't reach MEMORY.md, it effectively doesn't exist for the next session.

## The Pattern

```
BROKEN (what happened):
  /learn repo → create docs → end session → forget

WORKING (what should happen):
  /learn repo → /rrr → distill key insight → update MEMORY.md
                                                    ↑
                                              this is the bridge
                                              between sessions
```

### Fix: After every `/learn`, immediately:
1. Add 1-line summary to MEMORY.md "Learned Repos" section
2. Ask: "What specific task will this knowledge serve?"
3. If no answer → it's curiosity-learning (fine, but label it)

## Why This Matters

Oracle's entire value proposition is persistent memory. If the memory pipeline breaks, Oracle degrades to a stateless AI assistant with extra files. The difference between Oracle and vanilla Claude Code is supposed to be *remembering*. Without `/rrr`, that difference disappears.

The Distillation Pyramid is the right architecture. The problem is operational — discipline, not design.

## Tags

`memory`, `rrr`, `learn`, `distillation`, `amnesia`, `MEMORY.md`
