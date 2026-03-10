import { createProductionSpec } from './shared';

export const directorNotesStandaloneSpec = createProductionSpec({
	id: 'DirectorNotesStandalone',
	featureName: "Director's Notes",
	title: "Director's Notes standalone production storyboard",
	description:
		'40-second standalone production spec covering the move from fragmented agent oversight to unified history and grounded AI synopsis.',
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
				'Capture the cold-open or generating state so the synopsis feels grounded in actual history processing.',
			required: true,
		},
		{
			id: 'director-ai-overview-ready',
			feature: "Director's Notes AI Overview Ready",
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/DirectorNotes/AIOverviewTab.tsx',
			notes:
				'Capture the ready synopsis with lookback, `Regenerate`, `Save`, and `Copy` controls visible.',
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
			kind: 'live-capture',
			label: 'Director Notes modal shell capture',
			plannedSource: 'capture/live/director-notes/modal-open.mov',
			usage: 'Scene 1 modal-open proof and reusable shell for later scenes.',
			required: true,
		},
		{
			id: 'director-history-controls',
			kind: 'live-capture',
			label: 'Unified History controls capture',
			plannedSource: 'capture/live/director-notes/unified-history.mov',
			usage: 'Scenes 2 and 3 evidence-first browsing and actionability beats.',
			required: true,
		},
		{
			id: 'director-history-detail-card',
			kind: 'live-capture',
			label: 'History detail modal capture',
			plannedSource: 'capture/live/director-notes/history-detail.mov',
			usage: 'Scene 3 proof that the timeline can route back into the source session.',
			required: true,
		},
		{
			id: 'director-ai-overview-loading-card',
			kind: 'live-capture',
			label: 'AI Overview loading capture',
			plannedSource: 'capture/live/director-notes/ai-overview-loading.mov',
			usage: 'Scene 4 generation-state beat.',
			required: true,
		},
		{
			id: 'director-ai-overview-ready-card',
			kind: 'live-capture',
			label: 'AI Overview ready capture',
			plannedSource: 'capture/live/director-notes/ai-overview-ready.mov',
			usage: 'Scenes 5 and 6 synopsis-ready proof and closing comparison beat.',
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
		'src/renderer/components/DirectorNotes/UnifiedHistoryTab.tsx',
		'src/renderer/components/DirectorNotes/AIOverviewTab.tsx',
		'src/renderer/components/HistoryDetailModal.tsx',
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
				uiStateShown: "`Director's Notes` opening into the default `Unified History` state.",
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
			surfaceId: 'director-ai-overview',
			featureName: "Director's Notes",
			accentLabel: 'AI Overview',
			title: '`AI Overview` begins with a grounded generation step',
			body: 'The transition into synthesis stays credible because the feature first shows it is reading the underlying activity history.',
			durationInFrames: 180,
			captureIds: ['director-ai-overview-loading'],
			assetPlaceholderIds: ['director-ai-overview-loading-card'],
			storyboard: {
				sceneNumber: 4,
				purpose: 'Acknowledge the grounded generation step before showing the summary.',
				onScreenCopy: [
					'`AI Overview` is grounded in actual history files.',
					'Generation shows its work before the summary appears.',
				],
				visualComposition:
					'Transition from list view into `AI Overview` with loading or disabled-ready affordances visible.',
				uiStateShown:
					'`AI Overview` cold-open or generating state with lookback controls in frame.',
				userAction: 'Switch from `Unified History` to `AI Overview`.',
				systemResponse:
					'The synopsis pipeline begins from the underlying activity history rather than a blank prompt.',
				motionStyle: 'Controlled tab-slide transition with a subtle loading pulse.',
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
				userAction: 'Let the generation finish, then review or copy the result.',
				systemResponse: 'The modal presents a grounded summary that is ready to share or save.',
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
