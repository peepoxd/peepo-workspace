# Context is King: The PRPs Philosophy

**Date**: 2026-01-30
**Context**: Learning PRPs-agentic-eng repository
**Confidence**: High

## Key Learning

The PRPs (Product Requirement Prompts) framework reveals a fundamental truth about AI-assisted development: **context density determines success rate**. A PRP is not just a product requirements document — it's PRD + Curated Codebase Intelligence + Agent/Runbook combined.

The insight is simple but profound: AI agents need comprehensive context to ship production-ready code on the first pass. Vague instructions lead to multiple iterations. Rich context leads to one-pass success.

This means including:
- Exact file paths where similar patterns exist
- Code examples from the actual codebase
- Known gotchas and edge cases
- Executable validation commands

## The Pattern

```markdown
# Good PRP Structure

## Goal
[Clear end state and desires]

## Why
[Business value and user impact]

## What
[User-visible behavior and technical requirements]

## Context
- Documentation URLs
- Code examples FROM THIS CODEBASE
- Existing patterns to follow
- Known gotchas and edge cases

## Blueprint
[Pseudocode with critical details]

## Validation
[Executable commands for each level]
- Level 1: `ruff check && mypy .`
- Level 2: `pytest tests/ -v`
- Level 3: `npm run build`
```

## Why This Matters

This connects to Oracle philosophy: **"Patterns Over Intentions"** — document what actually happens in code, not what was intended. PRPs take this further by requiring the AI to see actual codebase patterns before implementing new ones.

**Application to Oracle development:**
- Skills should include concrete code examples
- Validation gates should be executable
- Context should come from the actual codebase, not abstractions

## Related Concept: Ralph Loop

The self-correcting autonomous loop:
```
Implement → Validate → If Failed: Fix → Re-validate → Loop Until Complete
```

This only works WITH good context. Without comprehensive PRPs, Ralph loops just iterate on bad implementations.

## Tags

`prps`, `agentic-engineering`, `context`, `validation`, `patterns`
