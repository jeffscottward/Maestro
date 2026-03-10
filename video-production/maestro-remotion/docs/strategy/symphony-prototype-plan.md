---
type: analysis
title: Maestro Symphony Standalone Video Strategy
created: 2026-03-10
tags:
  - remotion
  - maestro
  - symphony
  - strategy
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[approved-feature-video-narrative-structures]]'
  - '[[symphony-feature-research]]'
---

# Maestro Symphony Standalone Video Strategy

## Strategy Snapshot

- Runtime target: `45 seconds`
- Tone: `confident`, `systems-minded`, `developer-pragmatic`
- Copy density: `medium`
- Voiceover vs text: `muted-safe hybrid`; on-screen text must carry the workflow on its own, while optional sparse voiceover can sharpen pacing in the master export

## Narrative Structure

Selected structure: `Discovery -> Activation -> Proof` from `[[approved-feature-video-narrative-structures]]`.

Beat breakdown:

1. `Discovery`: show `Projects`, repository filtering, issue selection, and Auto Run document preview so the opportunity feels concrete.
2. `Activation`: move through `Start Symphony`, the prerequisite gate, and `Create Symphony Agent`, then show Maestro performing the setup work that normally lives outside the app.
3. `Proof`: resolve into `Active`, `History`, and `Stats` evidence so the viewer sees a coordinated contribution pipeline with draft PR state, live progress, and durable outcomes.

## Why This Structure Fits

Symphony is strongest when it starts as an open-source opportunity browser and ends as an active contribution lane. Developers do not need abstract community messaging here; they need proof that Maestro shortens the path from issue discovery to a running contribution with real state, real docs, and a real PR trail.

## Platform Plan

- Primary: `16:9` master for product pages, docs, YouTube, and launch demos where the full modal width and side-by-side issue context can stay visible.
- Secondary: `1:1` cutdown for LinkedIn and X feeds, keeping the issue list, document preview, and `Start Symphony` handoff inside a centered safe zone.
- Tertiary: `9:16` teaser cutdown only after the scene safe zones are locked, using tighter crops around the issue detail and `Create Agent` flow instead of trying to show the whole modal at once.

## Messaging Guardrails

- Preserve shipped labels including `Maestro Symphony`, `Projects`, `Active`, `History`, `Stats`, `Start Symphony`, and `Create Agent`.
- Preserve the real activation language: the dialog title is `Create Symphony Agent`, while the confirmation CTA is `Create Agent`.
- Treat the current implementation as source of truth: the setup flow creates an empty commit and draft PR during activation, even though some docs still describe later PR claiming.
- Use the `Active` card semantics from the current product code: draft PR visibility, progress, token usage, `Check PR Status`, and `Finalize PR` on `Ready for Review`.
- Show blocked or claimed issue context only as browsing information; do not imply those states can proceed straight into `Start Symphony`.
- Keep the feature framed as guided contribution orchestration, not as generic multi-agent collaboration with no repository context or PR outcome.

## Story Beats

1. Open on the tab strip and selected repository so a muted viewer immediately sees `Projects`, `Active`, `History`, and `Stats` as one contribution surface.
2. Land on one issue detail view and its Auto Run document preview to prove Maestro is packaging work, not just listing GitHub tickets.
3. Trigger `Start Symphony`, clear the prerequisite gate, and land in `Create Symphony Agent` with the repo, issue, session name, and working directory already attached.
4. Show the irreversible orchestration step Maestro owns: clone, branch, `Auto Run Docs`, and draft PR setup.
5. Resolve into the current `Active` card state with `Running` or `Ready for Review`, visible progress, token usage, and a draft PR link.
6. Finish on `History` plus `Stats` proof that the contribution becomes durable, measurable output inside Maestro.
