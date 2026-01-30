# Stop Hooks Create Feedback Loops Without External Orchestration

**Date**: 2026-01-30
**Context**: Learning ralph-loop plugin architecture
**Confidence**: High

## Key Learning

Claude Code's Stop hook system can be used to create self-referential feedback loops without needing external bash scripts or orchestration. The ralph-loop plugin demonstrates this elegantly: instead of wrapping Claude in a `while true` loop externally, it registers a Stop hook that intercepts session exit attempts and blocks them, feeding the same prompt back.

This is more powerful than external loops because:
1. The AI sees its previous work directly in modified files and git history
2. State persists naturally in the file system
3. No complex output parsing or piping needed
4. The loop runs within a single session, preserving all context

## The Pattern

```
User runs: /ralph-loop "Task" --completion-promise "DONE"
    ↓
Setup script creates: .claude/ralph-loop.local.md
    ↓
Claude works on task, modifies files
    ↓
Claude tries to exit session
    ↓
Stop hook intercepts, checks state file
    ↓
If <promise>DONE</promise> not found in output:
    Block exit, feed same prompt back
    ↓
Claude sees previous work in files
    ↓
Iterates until promise detected or max iterations
```

The hook returns JSON to control the session:
```json
{
  "decision": "block",
  "reason": "original_prompt_text",
  "systemMessage": "🔄 Ralph iteration N | ..."
}
```

## Why This Matters

This pattern opens up new possibilities for plugin developers:
- **Autonomous agents**: Plugins can create agent-like behavior within Claude Code
- **Iterative refinement**: Tasks that need multiple passes (TDD, bug fixing) can be automated
- **Self-correction**: AI can learn from its own failures without human intervention

The key insight is that Claude Code's hook system is not just for logging or validation - it's a full control plane for session behavior. Stop hooks specifically let you intercept and redirect the session flow, which is more powerful than it initially appears.

## Tags

`claude-code`, `plugins`, `hooks`, `stop-hook`, `ralph-loop`, `feedback-loops`, `agent-patterns`
