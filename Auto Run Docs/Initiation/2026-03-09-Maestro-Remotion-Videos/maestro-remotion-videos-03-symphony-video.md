# Phase 03: Symphony Video

This phase turns the shared prototype system into a finished standalone video for Maestro Symphony, focused on showing how coordinated multi-agent workflows replace chaotic one-agent-at-a-time execution. The goal is a production-ready 16:9 master that uses real Symphony semantics, believable Maestro UI states, and motion that makes orchestration feel structured and powerful.

## Tasks

- [x] Lock the final Symphony story before implementing scenes:
	- Reopen the Symphony research, strategy, storyboard, capture manifest, and any relevant source files before changing the video
	- Verify the video uses real Symphony terminology from Maestro, including the actual project browsing, issue selection, contribution start, active progress, and PR-related states
	- Tighten the scene list so it clearly communicates the workflow transformation from scattered effort to coordinated contribution
	- Update the Symphony spec and storyboard first if the implementation plan changes
	- Note: Revalidated the Symphony story against `docs/symphony.md`, `SYMPHONY_ISSUES.md`, `src/main/services/symphony-runner.ts`, `src/renderer/components/SymphonyModal.tsx`, `src/renderer/components/AgentCreationDialog.tsx`, the checked-in Symphony capture references, and `6` analyzed fallback images under `video-production/maestro-remotion/capture/docs/symphony/`.
	- Note: Updated `video-production/maestro-remotion/docs/research/features/symphony-feature-research.md`, `docs/strategy/symphony-prototype-plan.md`, `docs/storyboards/symphony-storyboard.md`, and `src/data/specs/symphony-standalone-spec.ts` to lock the real `Start Symphony` -> prerequisite gate -> `Create Symphony Agent` -> draft PR -> `Active`/`History`/`Stats` story.
	- Note: Tightened the source-material notes so the stale create-agent and active fallback screenshots are treated as visual references only, while current draft-PR and review-state behavior comes from product code and runner logic.
	- Note: Added terminology assertions for `Create Symphony Agent` in the isolated video-workspace tests and re-ran `pnpm validate:capture`, targeted Vitest coverage, and full `pnpm validate` in `video-production/maestro-remotion`; all `38` tests passed.

- [x] Build Symphony-specific UI modules and scene assets inside the isolated video workspace:
	- Search existing shared components in `src/ui`, `src/components`, and `src/scenes` before creating feature-specific duplicates
	- Implement the Symphony surfaces needed by the storyboard, such as project tiles, issue detail states, agent/session creation, progress cards, stats cards, and contribution history or achievement moments
	- Reuse Maestro theme tokens and spacing rules so the video still looks like Maestro rather than a new product
	- Keep all new code inside `video-production/maestro-remotion/`
	- Note: Added `video-production/maestro-remotion/src/components/SymphonySurfaceShowcase.tsx` and routed Symphony scenes through scene-specific variants for projects browse, issue detail, `Create Symphony Agent`, setup proof, `Active`, and `History`/`Stats`, while reusing the shared Maestro modal/stat/fallback primitives.
	- Note: Updated `video-production/maestro-remotion/src/lib/maestroVisualSystem.ts` and workspace tests so Symphony terminology now asserts the shipped labels (`Start Symphony`, `Create Symphony Agent`, `Check PR Status`, `Finalize PR`, `Ready for Review`) and treats the older screenshot fallbacks as visual-reference-only.
	- Note: Added `video-production/maestro-remotion/tests/symphony-surface-showcase.test.ts` for scene-variant mapping and render signatures, then re-ran `pnpm validate` in `video-production/maestro-remotion`; all `42` tests passed.

- [x] Integrate live-capture and fallback assets for the Symphony flow:
	- Connect the approved capture sources from Phase 02 to the specific storyboard scenes
	- Prefer reconstructed UI for elements that can be matched exactly, and use screenshot or trimmed recording fallback only where exact reconstruction would drift from the real product
	- Preserve state transitions such as browse, select, create agent, active execution, progress, and ready-for-review outcomes
	- Track every external asset used by the Symphony composition in the spec or asset manifest
	- Note: Reworked `video-production/maestro-remotion/src/data/specs/symphony-standalone-spec.ts` so the Symphony asset placeholders now point at the approved checked-in fallback references for browse, issue detail, `Create Symphony Agent`, `Active`, `History`, and `Stats`, with the setup checklist staying on the derived JSON proof asset.
	- Note: Updated `video-production/maestro-remotion/capture/manifests/symphony/symphony-capture-manifest.json` to promote those fallback files into concrete declared scene assets, add the missing `History` proof asset for the closing beat, and keep the scene-source notes explicit about where stale screenshots remain visual-reference-only; then aligned the checked-in capture metadata with `src/data/specs/symphony-standalone-spec.ts` so the manifest now preserves the shipped `Create Symphony Agent` source refs and current `Active` capture notes.
	- Note: Added `video-production/maestro-remotion/tests/symphony-capture-assets.test.ts`, hardened `video-production/maestro-remotion/src/lib/capture-pipeline.ts` to fail when checked-in capture metadata drifts from the source spec, analyzed `6` Symphony reference images under `video-production/maestro-remotion/capture/docs/symphony/`, and re-ran `pnpm test -- tests/symphony-capture-assets.test.ts`, `pnpm validate:capture`, and full `pnpm validate` in `video-production/maestro-remotion`; all `45` tests passed.

- [x] Implement the Symphony composition and motion choreography:
	- Build the full Symphony scene sequence using Remotion primitives only; do not use CSS animations or Tailwind animation classes
	- Choose explicit FPS for the Symphony master based on actual motion density, and keep the timing consistent with the approved runtime target
	- Use motion grammar that supports the feature story: panel reveals, cursor guidance, state transitions, progress resolution, and a confident final outcome
	- Make the opening hook immediately legible to developers without requiring voiceover
	- Note: Added a dedicated `SymphonyStandalone` Remotion composition path by registering the standalone master in `video-production/maestro-remotion/src/lib/composition-manifest.ts` and routing `FeatureHeroScene` through the new `video-production/maestro-remotion/src/scenes/SymphonyStandaloneScene.tsx` shell when the Symphony standalone spec is active.
	- Note: Implemented frame-driven choreography in `video-production/maestro-remotion/src/animations/symphony-choreography.ts` plus `video-production/maestro-remotion/src/components/SymphonyMotionPrimitives.tsx`, covering scene-stage camera motion, cursor guidance, the discovery-to-proof flow strip, staggered panel reveals, and animated closing metrics with the approved `30` fps master preserved.
	- Note: Deepened `video-production/maestro-remotion/src/components/SymphonySurfaceShowcase.tsx` so the `Create Symphony Agent`, setup, `Active`, and `History`/`Stats` states now animate in-scene with Remotion timing instead of static layout-only beats.
	- Note: Added targeted coverage in `video-production/maestro-remotion/tests/symphony-standalone-choreography.test.ts`, `video-production/maestro-remotion/tests/symphony-standalone-scene.test.tsx`, and updated registry/workspace tests; re-ran full `pnpm validate` in `video-production/maestro-remotion`, and all `49` tests passed.
	- Note: Analyzed `6` Symphony reference images under `video-production/maestro-remotion/capture/docs/symphony/` and rendered still checks to `Auto Run Docs/Working/symphony-opening-still-2.png` and `Auto Run Docs/Working/symphony-active-still.png` to tighten the 16:9 framing before closing the task.

- [x] Write Symphony-specific tests and quality checks:
	- Add tests for Symphony scene ordering, required scene IDs, schema validity, and any helper logic that maps capture states to rendered scenes
	- Add a render smoke check for the Symphony composition so broken imports, invalid assets, or schema regressions fail early
	- Keep tests scoped to the isolated video workspace
	- Note: Added `video-production/maestro-remotion/tests/symphony-standalone-validation.test.ts` to lock the approved Symphony scene order, required scene IDs, schema validity, and `getCapturesForScene()` capture-to-scene mapping against the standalone spec.
	- Note: Added `video-production/maestro-remotion/tests/symphony-render-smoke.test.ts` to render opening and closing `SymphonyStandalone` frames through the real Remotion CLI, so composition loading and scene-level asset usage fail early in CI.
	- Note: Analyzed `6` Symphony reference images under `video-production/maestro-remotion/capture/docs/symphony/` to confirm the smoke frames align with the checked-in browse, issue detail, create-agent, active, history, and stats proof states.
	- Note: Re-ran `pnpm validate` in `video-production/maestro-remotion`; capture validation, workspace validation, typecheck, and all `53` Vitest checks passed.

- [ ] Run Symphony validation and produce the 16:9 master render:
	- Execute the Symphony tests and any schema or render smoke commands, then fix issues until they pass
	- Render the 16:9 Symphony master into the workspace render output folder
	- Save `video-production/maestro-remotion/docs/reports/symphony-render-report.md` with YAML front matter, render settings, output path, source assets used, and any fidelity tradeoffs that still remain
