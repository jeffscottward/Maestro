import { MAESTRO_SOURCE_REFERENCES, PRESERVED_TERMINOLOGY } from '../lib/projectSources';

import { validateVideoSpec } from './production-schema';

export const workspaceBootstrapSpec = validateVideoSpec({
	id: 'MaestroWorkspaceBootstrap',
	featureName: 'Workspace Foundation',
	title: 'Maestro video-production/maestro-remotion',
	description:
		'Foundational Remotion architecture for Maestro product videos with schema-backed specs, scene manifests, and capture planning.',
	aspectRatio: '16:9',
	dimensions: {
		width: 1920,
		height: 1080,
	},
	fps: 30,
	runtimeSeconds: 6,
	motion: {
		entranceDurationFrames: 28,
		fadeInFrames: 18,
		fadeOutFrames: 14,
		spring: {
			damping: 200,
			stiffness: 140,
		},
	},
	terminology: [...PRESERVED_TERMINOLOGY],
	sourceRefs: [...MAESTRO_SOURCE_REFERENCES],
	capturePlan: [
		{
			id: 'project-sources',
			feature: 'Project Sources Research',
			mode: 'reconstructed-ui',
			sourceRef: 'docs/research/project-sources.md',
			notes:
				'Anchors Maestro terminology, screenshots, and source-of-truth references for later reconstructions.',
			required: true,
		},
		{
			id: 'director-notes-history',
			feature: "Director's Notes Unified History",
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/directors-notes-history.png',
			notes:
				'Use the exact Unified History screenshot until the dense history table is rebuilt as a data-driven surface.',
			required: true,
		},
		{
			id: 'autorun-worktree',
			feature: 'Run in Worktree',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/autorun-worktree.png',
			notes:
				'Keep the worktree dispatch form exact until the dedicated flow is reconstructed from structured controls.',
			required: true,
		},
	],
	scenes: [
		{
			id: 'foundation-intro',
			type: 'title-card',
			surfaceId: 'symphony-projects',
			featureName: 'Workspace Foundation',
			accentLabel: 'Foundation',
			title: 'Schema-backed Remotion workspace',
			body: 'The isolated Maestro video workspace now has shared composition registration, structured scene manifests, and motion presets instead of one-off component timing.',
			durationInFrames: 90,
			captureIds: ['project-sources'],
		},
		{
			id: 'foundation-schema',
			type: 'feature-spotlight',
			surfaceId: 'worktree-dispatch',
			featureName: 'Production Schema',
			accentLabel: 'Data Model',
			title: 'Scenes, captures, and motion stay in validated specs',
			body: "Each video can now declare source refs, required capture slots, and motion behavior in Zod-validated data before deeper Symphony, Director's Notes, and worktree productions land.",
			durationInFrames: 90,
			captureIds: ['project-sources', 'director-notes-history', 'autorun-worktree'],
		},
	],
});
