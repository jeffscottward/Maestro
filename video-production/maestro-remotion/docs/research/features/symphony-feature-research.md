---
type: research
title: Symphony Feature Research
created: 2026-03-10
tags:
  - remotion
  - maestro
  - symphony
  - research
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[director-notes-feature-research]]'
  - '[[worktree-spin-offs-feature-research]]'
---

# Symphony Feature Research

## Source References

- `docs/symphony.md`
- `SYMPHONY_ISSUES.md`
- `src/main/ipc/handlers/symphony.ts`
- `src/main/services/symphony-runner.ts`
- `src/renderer/components/SymphonyModal.tsx`
- `src/renderer/hooks/symphony/useSymphony.ts`
- `src/renderer/hooks/symphony/useSymphonyContribution.ts`
- `src/renderer/hooks/symphony/useContributorStats.ts`
- `src/renderer/hooks/batch/useBatchProcessor.ts`

## In-Product Labels To Preserve

- `Maestro Symphony`
- `Projects`
- `Active`
- `History`
- `Stats`
- `Start Symphony`
- `Create Agent`
- `Blocked`
- `Claimed`
- `Check PR Status`
- `GitHub CLI Required`
- `GitHub CLI Not Authenticated`
- `Build Tools Required`
- `Finalize PR`
- `Tokens Donated`
- `Time Contributed`
- `Streak`

## One-Sentence Takeaway

`Maestro Symphony` turns repository discovery, issue review, agent creation, Auto Run staging, and contribution tracking into one guided open-source contribution workflow.

## Value Proposition

- Contributors can browse `runmaestro.ai` issues, preview attached Auto Run documents, and start working without manually stitching together GitHub, local clone setup, and branch creation.
- Maintainers get contribution-ready issues that move from visible inventory to claimed draft PRs inside a single Maestro-native workflow.
- The video can show a concrete “browse to active contribution” transformation instead of abstract community branding.

## Technical Description

`SymphonyModal.tsx` is a four-tab modal with repository browsing in `Projects`, live contribution status in `Active`, completed runs in `History`, and milestone framing in `Stats`. Repository tiles expose category filters, search, stars, issue counts, and a detail view that splits issues into `In Progress`, `Available Issues`, and `Blocked`. Selecting an issue auto-loads the first Auto Run document preview and allows keyboard cycling through document previews with `Cmd/Ctrl+Shift+[` and `Cmd/Ctrl+Shift+]`. The start flow also includes prerequisite messaging around `GitHub CLI Required`, `GitHub CLI Not Authenticated`, and `Build Tools Required` before the user proceeds into `Create Symphony Agent`.

When the user clicks `Start Symphony`, the flow moves into the agent creation dialog and then into `startContribution()` in `src/main/services/symphony-runner.ts`. Current implementation behavior is: shallow clone repo, create a branch, configure git user, create an empty commit, push the branch, create a draft PR with `Closes #N`, then copy or download the referenced Auto Run documents into `Auto Run Docs/` before handing work to the created agent session. The `Active` tab then surfaces status values such as `Cloning`, `Creating PR`, `Running`, `Paused`, and `Ready for Review`, while the `Stats` tab derives achievements and cumulative token/time metrics from stored contribution history.

## Before Workflow

1. Find a contribution opportunity on GitHub and read the issue manually.
2. Inspect or download the referenced Auto Run documents yourself.
3. Clone the repository, create a branch, configure a local working directory, and create a claim PR.
4. Start an agent session separately and wire it to the cloned repo and task docs.

## After Workflow

1. Open `Maestro Symphony`, search or filter repositories, and pick an issue.
2. Review document previews directly inside the modal, including `Blocked` or `Claimed` status context.
3. Click `Start Symphony`, pick the provider in `Create Agent`, and confirm the working directory.
4. Let Maestro clone, branch, push, create the draft PR, stage the Auto Run docs, and move the contribution into `Active`.
5. Track progress, PR status, completion history, and contribution milestones without leaving Maestro.

## Primary Pain Solved

The feature removes the manual, brittle setup work between “this issue looks promising” and “an agent is actually contributing on a claimed branch with the right docs attached.”

## Who Benefits Most

Developers who want to donate tokens or time to open source without spending that effort on project discovery, local environment setup, and PR claim mechanics.

## Transformation Shown On Screen

The visual transformation is from a passive catalog of open-source opportunities to an actively claimed contribution pipeline where the issue is previewed, the agent is created, a draft PR is opened, and contribution progress becomes a live Maestro object.

## Capture-Critical UI States

- Repository grid with category chips, search, and issue-count metadata.
- Selected repository detail with separate `In Progress`, `Available Issues`, and `Blocked` sections.
- Issue-level document preview with dropdown selection and keyboard-driven document cycling.
- `Start Symphony` call-to-action moving into `Create Agent`.
- `Active` contribution cards showing status badges, progress, PR links, elapsed time, and token usage.
- Start-flow preflight states warning about GitHub CLI and build-tool prerequisites.
- `History` and `Stats` surfaces showing cumulative proof that the work completed.

## Source-of-Truth Notes

- `docs/symphony.md` and `SYMPHONY_ISSUES.md` describe deferred PR creation on the first meaningful commit, but `src/main/services/symphony-runner.ts` currently creates an empty commit and draft PR during initial setup. Video planning should treat the implementation as the source of truth until product behavior changes.
- `Blocked` issues remain visible and selectable for inspection, but only available issues can proceed into `Start Symphony`.
- `docs/symphony.md` still describes Pause/Resume/Cancel controls in `Active`, but the current card UI emphasizes sync/status review plus conditional `Finalize PR` actions rather than that fuller control set.
- The later strategy docs should link back to this note and to `[[master-production-plan]]` instead of rephrasing Maestro’s labels.
