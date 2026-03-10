# Phase 01: Foundation And Prototype

This phase creates a fully isolated Remotion workspace inside a new top-level `video-production/maestro-remotion/` folder, pulls Maestro’s real terminology and visual tokens from the existing repo, and ships a working 16:9 prototype that can be previewed and rendered without modifying the Electron app itself. By the end of the phase, there should be a running Remotion studio and at least one rendered video artifact that proves the production pipeline works.

## Tasks

- [x] Create the isolated Remotion workspace and capture source-of-truth references before building:
	- Before creating new files, inspect `docs/autorun-playbooks.md`, `docs/director-notes.md`, `docs/symphony.md`, `docs/git-worktrees.md`, `src/shared/themes.ts`, `src/renderer/components/SymphonyModal.tsx`, `src/renderer/components/DirectorNotes/DirectorNotesModal.tsx`, `src/renderer/components/AutoRunSetupModal.tsx`, and `src/renderer/components/WorktreeRunSection.tsx`
	- Create only a new top-level `video-production/maestro-remotion/` folder for the video work; do not modify root `package.json`, root build scripts, existing app code, or any non-video folders
	- Scaffold a standalone TypeScript + React + Remotion project in that folder using `pnpm`, with local config files, scripts, and its own lockfile
	- Create `video-production/maestro-remotion/docs/research/project-sources.md` with YAML front matter, exact source file references, product terminology to preserve, and wiki-links to later planning documents
	- Note: Added an isolated pnpm Remotion workspace with a bootstrap composition, source-manifest module, workspace validation script, and Vitest coverage limited to the new video folder.
	- Note: Verified `pnpm validate` passes and `pnpm exec remotion compositions src/index.ts` lists `MaestroWorkspaceBootstrap` without dependency-version warnings; no image files were attached directly to the playbook folder, but 8 linked product screenshots were reviewed from the referenced docs.

- [x] Set up the core Remotion architecture and shared production schema:
	- Search the new video workspace for any generated patterns before adding duplicate config or helper files
	- Create a clean folder structure with `src/compositions`, `src/scenes`, `src/components`, `src/ui`, `src/animations`, `src/data`, `src/assets`, `src/lib`, and `renders`
	- Register compositions in `src/Root.tsx` and use Remotion patterns that rely on `useCurrentFrame`, `useVideoConfig`, `interpolate`, and `spring`
	- Define a Zod-backed production schema for video specs, scene data, capture manifests, and motion settings so compositions can be driven from structured data instead of hardcoded timelines
	- Note: Replaced the single hardcoded bootstrap wiring with a composition registry, scene timeline helpers, and a schema-backed `workspaceBootstrapSpec` that now drives the `MaestroWorkspaceBootstrap` composition.
	- Note: Added the required folder structure and supporting modules under `video-production/maestro-remotion/src/`, plus placeholder `src/assets/` and `renders/` folders for later phases.
	- Note: Verified `pnpm validate` passes and `pnpm exec remotion compositions src/index.ts` still lists `MaestroWorkspaceBootstrap` at `30` fps and `1920x1080`.

- [x] Build a shared Maestro visual system for reconstruction work:
	- Reuse the token shape from `src/shared/themes.ts` instead of inventing a parallel theme model
	- Create reusable UI primitives that match Maestro’s visual language closely enough to support exact reconstruction later: modal shell, tab strip, stat card, activity row, Auto Run document list, worktree controls, terminal block, cursor, and annotation/note surfaces
	- Preserve real user-facing labels from Maestro docs and source, including `Maestro Symphony`, `Director's Notes`, `Run in Worktree`, and `Dispatch to a separate worktree`
	- If a surface cannot be matched exactly, add an explicit screenshot/video fallback slot rather than approximating the UI loosely
	- Note: Added a shared Maestro visual-system layer inside `video-production/maestro-remotion/src/` with theme-token reuse from `src/shared/themes.ts`, reusable chrome primitives, and screenshot fallback slots for unreconstructed surfaces.
	- Note: Updated the bootstrap scene preview to use the new visual primitives and preserved product copy including `Maestro Symphony`, `Director's Notes`, `Run in Worktree`, and `Dispatch to a separate worktree`.
	- Note: Verified `pnpm validate` passes and `pnpm exec remotion compositions src/index.ts` still lists `MaestroWorkspaceBootstrap` at `30` fps and `1920x1080`; reviewed 8 linked product screenshots from the Maestro docs for the reconstruction pass.

- [x] Implement a working prototype reel plus standalone composition stubs for all three target features:
	- Create one short `MaestroFeatureTeaser` composition that previews Symphony, Director's Notes, and Auto Run worktree flow in a single 16:9 reel
	- Create separate composition stubs for `SymphonyPrototype`, `DirectorNotesPrototype`, and `WorktreeSpinOffsPrototype` so later phases can deepen each video independently
	- Choose explicit FPS per composition using the provided policy; use 60 fps only when the motion density justifies it
	- Make the prototype feel product-specific by using real Maestro copy, real panel structures, and real interaction states instead of generic launch-video filler
	- Note: Added schema-backed specs for `MaestroFeatureTeaser`, `SymphonyPrototype`, `DirectorNotesPrototype`, and `WorktreeSpinOffsPrototype`, each registered as 16:9 compositions at `30` fps because the current prototype motion density does not justify `60` fps yet.
	- Note: Reworked the shared feature surface renderer into product-specific Maestro Symphony, Director's Notes, and Run in Worktree modal states with real tab labels, worktree controls, synopsis/history copy, and explicit screenshot fallback slots.
	- Note: Verified `pnpm validate` passes and `pnpm exec remotion compositions src/index.ts` lists all five available compositions at `1920x1080`; reviewed 8 linked product screenshots from the Maestro docs while matching the prototype surfaces.

- [x] Create initial structured production artifacts alongside the prototype:
	- Add `video-production/maestro-remotion/docs/strategy/master-production-plan.md` with YAML front matter summarizing the three-video scope, master aspect ratio, ratio adaptation plan, and open implementation constraints
	- Add starter JSON or TypeScript spec files in `src/data/specs/` for the teaser and three feature videos, even if later phases will replace placeholder scenes
	- Record which prototype scenes are reconstructed UI, which are data-driven text layers, and which still require live capture fallback
	- Note: Added `video-production/maestro-remotion/docs/strategy/master-production-plan.md` with structured front matter, stable wiki-links, starter spec module paths, a `16:9` master plan, and the initial `1:1` / `9:16` adaptation constraints.
	- Note: Added `src/data/specs/prototype-production-artifacts.ts` so the teaser plus all three feature stubs have a structured scene-delivery manifest that records reconstructed UI surfaces, shared data-driven text layers, and remaining fallback captures.
	- Note: Verified `pnpm validate` passes in `video-production/maestro-remotion`, including new Vitest coverage for the master production plan artifact and the prototype-production manifest.

- [x] Write prototype smoke tests and validation helpers:
	- Add tests that validate the production schema, composition registration, and minimum scene/spec completeness for the teaser and three feature stubs
	- Add a lightweight validation script that fails when required fields like `featureName`, `fps`, `runtimeSeconds`, `scenes`, or `capturePlan` are missing
	- Keep tests and validation inside the isolated video workspace only
	- Note: Added `video-production/maestro-remotion/src/lib/production-validation.ts` so the teaser plus all three feature stubs share one smoke-validation path for completeness checks and composition-registration alignment.
	- Note: Expanded the isolated workspace test coverage with `video-production/maestro-remotion/tests/prototype-smoke-validation.test.ts` and updated `tests/validate-workspace.test.ts` so required fields like `featureName`, `fps`, `runtimeSeconds`, `scenes`, and `capturePlan` are exercised directly.
	- Note: Updated `video-production/maestro-remotion/scripts/validate-workspace.mjs` to run the structured smoke validation via `tsx`, then verified `pnpm validate` passes in the isolated video workspace with `26` tests passing.

- [ ] Run the prototype end to end and fix issues until it works:
	- Install dependencies, run the video workspace test/build validation, and fix failures without touching non-video code
	- Start the Remotion studio on a `71xx` UI port; if it needs to stay running after the task completes, manage it with PM2 using a descriptive name such as `maestro-remotion-studio`
	- Render at least one actual output file into `video-production/maestro-remotion/renders/`
	- Save `video-production/maestro-remotion/docs/reports/phase-01-prototype-report.md` with YAML front matter, commands used, composition IDs, render output paths, chosen FPS values, and any remaining fidelity gaps linked back to `[[project-sources]]`
