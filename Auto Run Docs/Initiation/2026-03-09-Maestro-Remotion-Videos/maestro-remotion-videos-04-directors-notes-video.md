# Phase 04: Director's Notes Video

This phase produces the standalone Director's Notes feature video, centered on the shift from tab-by-tab checking to a unified, searchable, AI-assisted view of agent activity. The finished result should make the feature feel like an executive control surface for developers while staying faithful to Maestro’s actual tabs, filters, history views, and AI overview behavior.

## Tasks

- [x] Finalize the Director's Notes narrative and working scene list before implementation:
	- Revisit the Director's Notes research doc, strategy doc, storyboard, capture manifest, `docs/director-notes.md`, and the relevant source files under `src/renderer/components/DirectorNotes/`
	- Confirm that the video reflects the real feature structure: Help, Unified History, AI Overview, filtering/search behavior, activity context, and session jump-back behavior
	- Refine the story so the benefit progression is clear: fragmented oversight, unified visibility, AI synthesis, then faster decision-making
	- Update the Director's Notes spec and storyboard before writing scene code if you change sequence, copy, or pacing
	- Completed 2026-03-10: aligned the narrative artifacts to the shipped UI by documenting visible tab order, background `AI Overview` generation, current `Regenerate` labeling, session jump-back proof, and the stale ready-state screenshot constraint. Added a focused planning-alignment test and validated the updated Director's Notes docs/spec/capture suite.

- [x] Build the Director's Notes scene modules and supporting UI components:
	- Search existing shared UI and scene primitives first so this phase extends the Phase 01 foundation instead of duplicating it
	- Implement the feature-specific surfaces required by the storyboard: modal shell variants, tab navigation, history rows, stats bar, search/filter UI, AI overview content blocks, and session navigation cues
	- Preserve exact Maestro naming and hierarchy in the UI layers and text treatment
	- Keep all implementation inside the isolated video workspace
	- Completed 2026-03-10: added dedicated Director's Notes remotion primitives plus standalone surface variants for default history, filtered history, detail modal, AI warmup, ready synopsis, and evidence-bridge states; introduced a Director's Notes standalone scene shell with flow-stage framing and fragmented-context backdrop; routed `DirectorNotesStandalone` through the dedicated scene path; analyzed 2 checked-in Director's Notes screenshots while matching control order/copy; and added focused vitest coverage for the new scene and surface modules.

- [x] Wire the Director's Notes scenes to capture-backed source material:
	- Use the approved Phase 02 capture manifest as the source of truth for which states are live capture, doc-based reference, or exact reconstruction
	- Reconstruct lists, stat bars, tabs, and markdown report surfaces when they can match the real app precisely
	- Use fallback image or video slots for surfaces that are too variable or expensive to recreate exactly
	- Ensure the video includes meaningful state shifts such as loading, browsing, filtering, overview generation, and actionable summary
	- Completed 2026-03-10: rewired `director-notes-standalone-spec.ts` and the checked-in Director's Notes capture manifest so scene assets now resolve to the approved doc-backed screenshots and derived reconstruction proofs instead of planned live `.mov` paths; added `history-detail-proof.json` and `ai-overview-loading-proof.json` under `capture/derived/director-notes/`; made `DirectorNotesSurfaceShowcase` consume manifest-backed fallback slots plus the derived evidence/loading/detail proof data for the detail, warmup, ready, and closing states; analyzed 2 checked-in Director's Notes screenshots while matching the capture-backed surfaces; and ran `pnpm validate` in `video-production/maestro-remotion` with all 25 test files / 62 tests passing.

- [ ] Implement the full Director's Notes composition and motion system:
	- Build the scene sequence with Remotion timing primitives only and keep the motion polished but information-dense
	- Choose explicit FPS based on actual motion needs, especially if the composition uses cursor motion, list traversal, or scroll-based transitions
	- Use motion to emphasize clarity: focus shifts, graph or list reveals, summary build-up, and rapid navigation back into an agent session
	- Keep on-screen copy concise enough for a 30 to 60 second feature-education video

- [ ] Write Director's Notes-specific tests and smoke checks:
	- Add tests for spec validity, scene completeness, tab/state ordering, and any feature-specific data transforms or helper functions
	- Add a composition smoke render or equivalent validation for the Director's Notes master
	- Keep test coverage inside the video workspace

- [ ] Run Director's Notes validation and render the 16:9 master:
	- Execute the feature tests and render smoke checks, then fix broken assets, scene IDs, timing regressions, or layout issues until they pass
	- Render the 16:9 Director's Notes master into the workspace output folder
	- Save `video-production/maestro-remotion/docs/reports/directors-notes-render-report.md` with YAML front matter, final settings, output locations, and any remaining fidelity notes tied back to the research docs
