---
type: research
title: Phase 02 Source Material Log
created: 2026-03-10
tags:
  - remotion
  - capture
  - maestro
  - source-material
related:
  - '[[feature-capture-plan]]'
  - '[[symphony-feature-research]]'
  - '[[director-notes-feature-research]]'
  - '[[worktree-spin-offs-feature-research]]'
  - '[[symphony-setup-proof-reconstruction]]'
  - '[[director-notes-history-detail-reconstruction]]'
  - '[[director-notes-ai-overview-loading-reconstruction]]'
  - '[[director-notes-evidence-link-reconstruction]]'
  - '[[worktree-terminal-proof-reconstruction]]'
---

# Phase 02 Source Material Log

## Capture Attempts

- Live product attempt
  - `pnpm dev:demo` launched the Electron app successfully on March 10, 2026 with isolated data under `/tmp/maestro-demo`.
  - The boot attempt proved the safe runtime path, but the fresh demo profile did not include seeded Symphony issues, Director's Notes history, or Auto Run worktree inventory rich enough for autonomous end-to-end capture.
- Browser documentation attempt
  - `agent-browser install` completed successfully.
  - Follow-up `agent-browser open ...` commands failed with `Daemon not found. Set AGENT_BROWSER_HOME environment variable or run from project directory.`
  - Because the browser-capture path was blocked, the checked-in repo docs and screenshots became the doc-backed fallback source of truth for this pass.

## Source Strategy

- `Symphony`
  - Use the checked-in screenshots for projects browse, issue detail, history, and stats states.
  - Treat the checked-in create-agent and active screenshots as visual fallbacks only; their copy predates the current `Create Symphony Agent` dialog title and the current draft-PR-aware `Active` card state.
  - Use `[[symphony-setup-proof-reconstruction]]` plus `capture/derived/symphony/setup-checklist.json` for the setup-proof beat that combines runtime behavior with the current docs mismatch.
- `Director's Notes`
  - Use the checked-in Unified History and AI Overview screenshots for visible modal states.
  - Use `[[director-notes-history-detail-reconstruction]]` and `[[director-notes-ai-overview-loading-reconstruction]]` for states without checked-in screenshots.
  - Use `[[director-notes-evidence-link-reconstruction]]` plus `capture/derived/director-notes/evidence-link.json` for the evidence-to-synopsis overlay beat.
- `Worktree Spin-offs`
  - Use the checked-in Auto Run worktree, worktree configuration, and worktree list screenshots for entry, interaction, and inventory states.
  - Use `[[worktree-terminal-proof-reconstruction]]` plus `capture/derived/worktree/terminal-proof.json` for the isolated-terminal close.

## Outcome

The per-feature capture manifests now resolve every planned state to one of four concrete source types:

- live capture attempt with documented outcome
- repo screenshot fallback copied into `capture/docs/`
- source-grounded reconstructed UI plan under `docs/research/reconstructions/`
- derived proof-card JSON under `capture/derived/`
