import { createProductionSpec } from './shared';

export const directorNotesStandaloneSpec = createProductionSpec({
	id: 'DirectorNotesStandalone',
	featureName: "Director's Notes",
	title: "Director's Notes standalone production storyboard",
	description:
		'40-second standalone production spec covering the move from fragmented agent oversight to unified history and grounded AI synopsis, with AI Overview warming in the background before the ready summary resolves.',
	fps: 30,
	runtimeSeconds: 40,
	aspectRatioIntent: {
		primary: '16:9',
		adaptations: [
			{
				ratio: '1:1',
				framing:
					'Center the stats row, filter pills, and synopsis header while using tighter crops for long timeline rows or markdown paragraphs.',
				safeZone:
					'Keep `Unified History`, `AI Overview`, and the key control strip inside the middle crop so the story still reads without peripheral list density.',
			},
			{
				ratio: '9:16',
				framing:
					'Stack the history controls and synopsis header as vertical story beats, using list rows and markdown blocks as guided inserts instead of full-width panels.',
				safeZone:
					'Protect tab labels, control buttons, and the active summary section in a tall central column with animated transitions between evidence and synthesis.',
			},
		],
	},
	capturePlan: [
		{
			id: 'director-modal-open',
			feature: "Director's Notes Modal Open",
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
			notes:
				'Capture the modal opening with the visible tab order `Help`, `Unified History`, and `AI Overview`.',
			required: true,
		},
		{
			id: 'director-unified-history',
			feature: "Director's Notes Unified History",
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/DirectorNotes/UnifiedHistoryTab.tsx',
			notes:
				'Capture the stats row, filters, search, and dense history rows in the default `Unified History` view.',
			required: true,
		},
		{
			id: 'director-history-detail',
			feature: 'Director Notes History Detail',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/HistoryDetailModal.tsx',
			notes:
				'Capture the detail modal proving the timeline is actionable and can route back to the originating session.',
			required: true,
		},
		{
			id: 'director-ai-overview-loading',
			feature: "Director's Notes AI Overview Loading",
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/DirectorNotes/AIOverviewTab.tsx',
			notes:
				'Capture the background generation state so the synopsis feels grounded in actual history processing before the user leaves `Unified History`.',
			required: true,
		},
		{
			id: 'director-ai-overview-ready',
			feature: "Director's Notes AI Overview Ready",
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/DirectorNotes/AIOverviewTab.tsx',
			notes:
				'Capture the ready synopsis with lookback, `Regenerate`, `Save`, and `Copy` controls visible; if using the checked-in screenshot fallback, reconstruct the current control label from source.',
			required: true,
		},
		{
			id: 'director-evidence-link',
			feature: 'Director Notes Evidence Link',
			mode: 'derived-asset',
			sourceRef: 'src/main/ipc/handlers/director-notes.ts',
			notes:
				'Represent the link between history-file evidence and the generated synopsis so the summary is framed as grounded, not freeform.',
			required: true,
		},
	],
	assetPlaceholders: [
		{
			id: 'director-modal-shell',
			kind: 'doc-capture',
			label: 'Director Notes modal shell reference',
			plannedSource: 'capture/docs/director-notes/unified-history-reference.png',
			usage:
				'Scene 1 fallback reference for the modal shell and tab strip while the composition preserves the current shipped tab order and labels.',
			required: true,
		},
		{
			id: 'director-history-controls',
			kind: 'doc-capture',
			label: 'Unified History reference capture',
			plannedSource: 'capture/docs/director-notes/unified-history-reference.png',
			usage:
				'Scenes 2 and 3 fallback reference for the shipped `Unified History` list, stats bar, and tab strip while the filtering and detail beats stay reconstruction-first.',
			required: true,
		},
		{
			id: 'director-history-detail-card',
			kind: 'reconstructed-ui',
			label: 'History detail proof asset',
			plannedSource: 'capture/derived/director-notes/history-detail-proof.json',
			usage:
				'Scene 3 reconstructed-ui reference proving the detail modal, arrow navigation, and session jump-back behavior when no checked-in screenshot exists.',
			required: true,
		},
		{
			id: 'director-ai-overview-loading-card',
			kind: 'reconstructed-ui',
			label: 'AI Overview loading proof asset',
			plannedSource: 'capture/derived/director-notes/ai-overview-loading-proof.json',
			usage:
				'Scene 4 reconstructed-ui reference for the loading state where `AI Overview` is warming in the background before the tab becomes ready.',
			required: true,
		},
		{
			id: 'director-ai-overview-ready-card',
			kind: 'doc-capture',
			label: 'AI Overview ready reference capture',
			plannedSource: 'capture/docs/director-notes/ai-overview-ready-reference.png',
			usage:
				'Scenes 5 and 6 fallback reference for the synopsis-ready layout while the composition preserves the current `Regenerate` label from source.',
			required: true,
		},
		{
			id: 'director-grounded-synthesis-overlay',
			kind: 'motion-graphic',
			label: 'Grounded synthesis overlay',
			plannedSource: 'capture/derived/director-notes/evidence-link.json',
			usage: 'Scene 6 overlay connecting the timeline evidence to the generated summary.',
			required: true,
		},
	],
	terminology: [
		'Help',
		'Unified History',
		'AI Overview',
		'AUTO',
		'USER',
		'Lookback',
		'Regenerate',
		'Save',
		'Copy',
	],
	sourceRefs: [
		'src/main/ipc/handlers/director-notes.ts',
		'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
		'src/renderer/components/DirectorNotes/UnifiedHistoryTab.tsx',
		'src/renderer/components/DirectorNotes/AIOverviewTab.tsx',
		'src/renderer/components/HistoryDetailModal.tsx',
		'docs/director-notes.md',
		'docs/research/features/director-notes-feature-research.md',
		'docs/strategy/director-notes-prototype-plan.md',
	],
	scenes: [
		{
			id: 'director-notes-standalone-open',
			type: 'title-card',
			surfaceId: 'director-history',
			featureName: "Director's Notes",
			accentLabel: 'Unified History',
			title: "`Director's Notes` replaces fragmented agent status hunting",
			body: 'The story opens by collapsing scattered agent context into one evidence-first surface that is ready for operational review.',
			durationInFrames: 180,
			captureIds: ['director-modal-open'],
			assetPlaceholderIds: ['director-modal-shell'],
			storyboard: {
				sceneNumber: 1,
				purpose:
					'Frame fragmented agent oversight as a real operational burden before the feature resolves it.',
				onScreenCopy: [
					'Too many agent tabs, not enough shared context.',
					"`Director's Notes` becomes the single status surface.",
				],
				visualComposition:
					'Blur or compress background agent clutter, then bring the modal header and tabs into sharp focus.',
				uiStateShown:
					"`Director's Notes` opening into the default `Unified History` state with `Help`, `Unified History`, and `AI Overview` visible in the tab strip.",
				userAction: "Open `Director's Notes` from Maestro.",
				systemResponse:
					'The modal lands directly in `Unified History` with the evidence-first view ready.',
				motionStyle: 'Pull focus from surrounding agent clutter into the centered modal shell.',
				durationSeconds: 6,
			},
		},
		{
			id: 'director-notes-standalone-history',
			type: 'feature-spotlight',
			surfaceId: 'director-history',
			featureName: "Director's Notes",
			accentLabel: 'Filters',
			title: '`Unified History` makes project-wide activity legible',
			body: 'Stats, filters, search, and dense rows stay visible together so the user can understand multiple agents without tab-hopping.',
			durationInFrames: 210,
			captureIds: ['director-unified-history'],
			assetPlaceholderIds: ['director-history-controls'],
			storyboard: {
				sceneNumber: 2,
				purpose: 'Show `Unified History` as the central operational control surface.',
				onScreenCopy: [
					'`Unified History` merges `AUTO` and `USER` work.',
					'Search, filters, and stats stay in view.',
				],
				visualComposition:
					'Wide list-first composition with stats row, filter pills, search, and timeline entries all readable together.',
				uiStateShown: '`Unified History` with filters, search, stats, and dense activity rows.',
				userAction: 'Toggle filters and enter a search term.',
				systemResponse:
					'The list narrows while the overview still reads as one project-wide timeline.',
				motionStyle: 'Horizontal parallax across controls and list rows with precise cursor beats.',
				durationSeconds: 7,
			},
		},
		{
			id: 'director-notes-standalone-detail',
			type: 'capture-callout',
			surfaceId: 'director-history',
			featureName: "Director's Notes",
			accentLabel: 'Detail',
			title: 'The timeline stays actionable through history detail and session return paths',
			body: "The viewer sees that `Director's Notes` is not passive reporting: the detailed evidence still routes back to the originating work.",
			durationInFrames: 210,
			captureIds: ['director-unified-history', 'director-history-detail'],
			assetPlaceholderIds: ['director-history-controls', 'director-history-detail-card'],
			storyboard: {
				sceneNumber: 3,
				purpose: 'Prove the history is actionable, not passive reporting.',
				onScreenCopy: [
					'Open the detail view, then jump back to the agent.',
					'This is observability with a return path.',
				],
				visualComposition:
					'Layer the detail modal over the list and keep the originating session context visible.',
				uiStateShown: 'History detail modal with resume and entry navigation affordances.',
				userAction: 'Select a history row to inspect its details.',
				systemResponse:
					'The detail view exposes the originating session and navigation controls for deeper follow-up.',
				motionStyle: 'Focused zoom into the selected row followed by a modal settle.',
				durationSeconds: 7,
			},
		},
		{
			id: 'director-notes-standalone-ai-loading',
			type: 'capture-callout',
			surfaceId: 'director-history',
			featureName: "Director's Notes",
			accentLabel: 'Warmup',
			title: '`AI Overview` starts building before the user leaves `Unified History`',
			body: 'The transition into synthesis stays credible because the feature shows background progress while the user is still reviewing the raw evidence.',
			durationInFrames: 180,
			captureIds: ['director-ai-overview-loading'],
			assetPlaceholderIds: ['director-ai-overview-loading-card'],
			storyboard: {
				sceneNumber: 4,
				purpose:
					'Show that synthesis starts from the same evidence before the user even leaves the timeline.',
				onScreenCopy: [
					'While you review the timeline, `AI Overview` is already building in the background.',
					'The summary is earned before it is opened.',
				],
				visualComposition:
					'Keep `Unified History` active while the tab-strip spinner and light loading cues telegraph background synthesis from the same evidence set.',
				uiStateShown:
					'`Unified History` remains active while `AI Overview` shows generating state in the tab strip.',
				userAction:
					'Continue reviewing `Unified History` while `AI Overview` generates in the background.',
				systemResponse:
					'The tab strip shows background progress and only enables `AI Overview` after the synopsis exists.',
				motionStyle:
					'Hold on evidence rows, then rack focus to the tab-strip spinner and loading feedback.',
				durationSeconds: 6,
			},
		},
		{
			id: 'director-notes-standalone-ai-ready',
			type: 'feature-spotlight',
			surfaceId: 'director-ai-overview',
			featureName: "Director's Notes",
			accentLabel: 'Synopsis',
			title: '`Regenerate`, `Save`, and `Copy` stay attached to the ready summary',
			body: 'The synopsis resolves as a shareable artifact, but it remains visibly tied to lookback controls and the grounded generation context.',
			durationInFrames: 210,
			captureIds: ['director-ai-overview-ready'],
			assetPlaceholderIds: ['director-ai-overview-ready-card'],
			storyboard: {
				sceneNumber: 5,
				purpose: 'Resolve into the ready synopsis with export controls.',
				onScreenCopy: [
					'`Regenerate`, `Save`, and `Copy` stay next to the summary.',
					'Raw history becomes a shareable update.',
				],
				visualComposition:
					'Markdown synopsis hero with controls, lookback setting, and summary stats kept on screen together.',
				uiStateShown: 'Ready `AI Overview` state with synopsis sections and export controls.',
				userAction: 'Select the now-ready `AI Overview` tab.',
				systemResponse:
					'The modal switches to a grounded summary that is ready to review, save, or copy.',
				motionStyle:
					'Section-by-section reveal with steady camera framing to preserve readability.',
				durationSeconds: 7,
			},
		},
		{
			id: 'director-notes-standalone-close',
			type: 'title-card',
			surfaceId: 'director-ai-overview',
			featureName: "Director's Notes",
			accentLabel: 'Check-In',
			title: 'One timeline first, one grounded summary second',
			body: 'The close pairs raw evidence with synthesis so the feature lands as a repeatable status workflow instead of a one-off summary trick.',
			durationInFrames: 210,
			captureIds: [
				'director-unified-history',
				'director-ai-overview-ready',
				'director-evidence-link',
			],
			assetPlaceholderIds: [
				'director-history-controls',
				'director-ai-overview-ready-card',
				'director-grounded-synthesis-overlay',
			],
			storyboard: {
				sceneNumber: 6,
				purpose:
					'Close on faster project check-ins built from evidence first and synthesis second.',
				onScreenCopy: [
					'One timeline first. One grounded summary second.',
					'No more tab-by-tab status hunting.',
				],
				visualComposition:
					'End on a relationship shot between timeline evidence and final synopsis output.',
				uiStateShown: '`Unified History` and `AI Overview` shown as a linked workflow.',
				userAction: 'Compare the raw activity view and the synopsis result.',
				systemResponse:
					'The feature lands as a repeatable status workflow instead of a one-off summary trick.',
				motionStyle: 'Crossfade between timeline and summary with anchored callout labels.',
				durationSeconds: 7,
			},
		},
	],
});
