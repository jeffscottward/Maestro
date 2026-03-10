---
type: research
title: Maestro Remotion Project Sources
created: 2026-03-10
tags:
  - remotion
  - maestro
  - source-of-truth
  - visual-reference
related:
  - '[[master-production-plan]]'
  - '[[phase-01-prototype-report]]'
  - '[[feature-capture-plan]]'
  - '[[symphony-prototype-plan]]'
  - '[[director-notes-prototype-plan]]'
  - '[[worktree-spin-offs-prototype-plan]]'
---

# Maestro Remotion Project Sources

## Scope

This note captures the source-of-truth docs, code, terminology, and screenshots reviewed before any prototype reconstruction work begins inside `video-production/maestro-remotion/`.

## Exact Source References

- `docs/autorun-playbooks.md`
  - Preserve Auto Run language around document queues, Playbooks, history entries, and the worktree dispatch flow.
- `docs/director-notes.md`
  - Preserve the product framing for the Unified History, AI Overview, Help tabs, and the aggregate timeline view.
- `docs/symphony.md`
  - Preserve the contribution narrative, four-tab structure, issue browsing flow, and the agent creation language.
- `docs/git-worktrees.md`
  - Preserve the nested worktree model, configuration modal copy, and removal/PR terminology.
- `src/shared/themes.ts`
  - Treat the `THEMES` export and the `colors` token shape as the visual source of truth for later reconstruction.
- `src/renderer/components/SymphonyModal.tsx`
  - Source for modal structure, tab naming, issue/project tiles, status labels, and contribution states.
- `src/renderer/components/DirectorNotes/DirectorNotesModal.tsx`
  - Source for Director's Notes modal header, tabs, generation state labels, and layout rhythm.
- `src/renderer/components/AutoRunSetupModal.tsx`
  - Source for Auto Run explanatory copy, icon-text rows, and form treatment.
- `src/renderer/components/WorktreeRunSection.tsx`
  - Source for the `Run in Worktree` section, toggle semantics, branch naming copy, and worktree status behaviors.

## Visual References Reviewed

Reviewed screenshots for layout, copy, spacing, and color cues:

- `docs/screenshots/symphony-list.png`
- `docs/screenshots/symphony-details.png`
- `docs/screenshots/symphony-create-agent.png`
- `docs/screenshots/directors-notes-history.png`
- `docs/screenshots/directors-notes-ai-overview.png`
- `docs/screenshots/autorun-worktree.png`
- `docs/screenshots/git-worktree-configuration.png`
- `docs/screenshots/git-worktree-list.png`

Observed patterns worth preserving later:

- Monospaced interface typography dominates headings, labels, inputs, and stats.
- Modal shells use dark layered panels with thin lavender borders and rounded corners.
- Accent usage centers on pink, violet, and periwinkle highlights against near-black backgrounds.
- Tables, pills, and section labels use compact uppercase or smallcaps-like treatments rather than generic marketing typography.
- The worktree flow depends on real form labels and state toggles, not abstract "branch management" language.

## Product Terminology To Preserve

- `Maestro Symphony`
- `Director's Notes`
- `Unified History`
- `AI Overview`
- `Run in Worktree`
- `Dispatch to a separate worktree`
- `Create New Worktree`
- `Base Branch`
- `Worktree Branch Name`
- `Automatically create PR when complete`
- `Create Agent`
- `Start Symphony`
- `Playbooks`
- `Auto Run`

Also preserve Maestro's user-facing distinction between an `agent` and a provider `session` from `CLAUDE.md`.

## Theme Token Notes

The later video UI system should mirror the existing Maestro token model instead of inventing a parallel one:

- `bgMain`
- `bgSidebar`
- `bgActivity`
- `border`
- `textMain`
- `textDim`
- `accent`
- `accentDim`
- `accentText`
- `accentForeground`
- `success`
- `warning`
- `error`

## Follow-On Planning Documents

These wiki-links should stay stable as later planning artifacts are added:

- `[[master-production-plan]]`
- `[[phase-01-prototype-report]]`
- `[[feature-capture-plan]]`
- `[[symphony-prototype-plan]]`
- `[[director-notes-prototype-plan]]`
- `[[worktree-spin-offs-prototype-plan]]`
