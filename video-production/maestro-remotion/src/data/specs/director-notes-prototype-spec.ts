import { createPrototypeSpec } from './shared';

export const directorNotesPrototypeSpec = createPrototypeSpec({
	id: 'DirectorNotesPrototype',
	featureName: "Director's Notes",
	title: "Director's Notes prototype",
	description:
		'Standalone Director\'s Notes stub covering Unified History and the AI Overview synopsis workflow.',
	fps: 30,
	runtimeSeconds: 6,
	capturePlan: [
		{
			id: 'director-notes-history',
			feature: "Director's Notes Unified History",
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/directors-notes-history.png',
			notes: 'Keep the history table exact until the dense modal contents are reconstructed row-for-row.',
			required: true,
		},
		{
			id: 'director-notes-ai-overview',
			feature: "Director's Notes AI Overview",
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/directors-notes-ai-overview.png',
			notes: 'Use the exact AI Overview screenshot while the markdown synopsis treatment is refined.',
			required: true,
		},
		{
			id: 'director-notes-modal',
			feature: "Director's Notes Modal",
			mode: 'reconstructed-ui',
			sourceRef: 'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
			notes: 'Preserve the Help, Unified History, and AI Overview tab structure from the product modal.',
			required: true,
		},
	],
	scenes: [
		{
			id: 'director-history-overview',
			type: 'title-card',
			surfaceId: 'director-history',
			featureName: "Director's Notes",
			accentLabel: 'Unified History',
			title: 'Unified History gathers AUTO and USER activity into one feed',
			body: 'The prototype keeps the stats bar, search, and jump-back session affordances visible so later phases can match the full browsing density without changing the timeline structure.',
			durationInFrames: 90,
			captureIds: ['director-notes-modal', 'director-notes-history'],
		},
		{
			id: 'director-ai-overview-flow',
			type: 'feature-spotlight',
			surfaceId: 'director-ai-overview',
			featureName: 'AI Overview',
			accentLabel: 'Synopsis',
			title: 'AI Overview turns recent activity into a structured synopsis',
			body: 'Lookback controls, Refresh, Save, and Copy stay visible in the stub so the later production can deepen the markdown and reporting animation rather than rebuilding the shell.',
			durationInFrames: 90,
			captureIds: ['director-notes-modal', 'director-notes-ai-overview'],
		},
	],
});
