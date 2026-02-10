---
query: "Oracle จะใช้ idea ของ RAG ได้ยังไง"
mode: deep
timestamp: 2026-01-31 10:00
oracle_results: 0
escalated: true
---

# Trace: Oracle จะใช้ idea ของ RAG ได้ยังไง

**Mode**: deep (5 parallel agents)
**Time**: 2026-01-31 10:00 UTC

## Oracle Results
None (Oracle MCP not connected)

## Key Findings

### Oracle v2 Already Implements RAG!

**Location**: `ψ/learn/Soul-Brews-Studio/oracle-v2/`

**Architecture**:
```
MCP Client (Claude) → MCP Server → SQLite + ChromaDB
                          ↓
                    HTTP API (Hono.js)
                          ↓
                    React Dashboard
```

### Hybrid Search Strategy

1. **FTS5 Keyword Search** (SQLite) — Fast, exact matching
2. **Vector Semantic Search** (ChromaDB) — Conceptual similarity
3. **Merge & Deduplicate** — Combine results
4. **Score Normalization** — 0.5 weight each, 10% boost if both match

### MCP Tools for RAG

| Tool | Function |
|------|----------|
| `oracle_search` | Hybrid FTS5 + vector search |
| `oracle_learn` | Add patterns to knowledge base |
| `oracle_consult` | Decision guidance from principles |
| `oracle_reflect` | Random wisdom selection |
| `oracle_trace` | Log discovery sessions |

### Knowledge Distillation Pyramid

```
ψ/active/context (raw, 20-50 KB)
         ↓
ψ/memory/logs (snapshots, 3-5 KB)
         ↓
ψ/memory/retrospectives (narratives)
         ↓
ψ/memory/learnings (patterns, 1-2 KB)
         ↓
ψ/memory/resonance (wisdom)
         ↓
CLAUDE.md (principles)
```

### Skills Using RAG Pattern

| Skill | RAG Feature |
|-------|-------------|
| `/trace` | `oracle_search()` + auto-escalation |
| `/watch` | Video → transcript → oracle_learn() |
| `/learn` | Codebase → docs → index |
| `/fyi --important` | Auto-calls oracle_learn() |
| `/rrr` | Session → distill → oracle_learn() |

## Files Found

### Primary Sources
- `ψ/learn/Soul-Brews-Studio/oracle-v2/2026-01-29_SUMMARY.md`
- `docs/tree/ORACLE-CONCEPT.txt`
- `docs/tree/BRAIN-GUIDE.txt`
- `ψ/memory/resonance/oracle.md`

### Implementation (ghq)
- `/home/codespace/ghq/github.com/Soul-Brews-Studio/oracle-v2`
  - `src/indexer.ts` — Granular document indexing
  - `src/chroma-mcp.ts` — MCP client for ChromaDB
  - `src/server/handlers.ts` — Hybrid search

## Conclusion

**Oracle ALREADY uses RAG concepts** through:
1. ChromaDB for vector embeddings
2. SQLite FTS5 for keyword search
3. MCP protocol for AI integration
4. Hybrid scoring (semantic + keyword)

The difference is **philosophy-first**: Oracle adds "Nothing is Deleted" and "Patterns Over Intentions" on top of standard RAG.
