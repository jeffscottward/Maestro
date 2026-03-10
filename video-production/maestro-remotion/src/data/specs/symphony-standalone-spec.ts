import { createProductionSpec } from './shared';

export const symphonyStandaloneSpec = createProductionSpec({
	id: 'SymphonyStandalone',
	featureName: 'Maestro Symphony',
	title: 'Maestro Symphony standalone production storyboard',
	description:
		'45-second standalone production spec covering the browse-to-claimed-contribution Symphony workflow.',
	fps: 30,
	runtimeSeconds: 45,
	aspectRatioIntent: {
		primary: '16:9',
		adaptations: [
			{
				ratio: '1:1',
				framing:
					'Center the selected project, issue detail, and activation CTA while secondary repository chrome compresses into the side safe zone.',
				safeZone:
					'Keep `Projects`, issue status, and `Start Symphony` inside the central 1080x1080 crop so the handoff remains readable without voiceover.',
			},
			{
				ratio: '9:16',
				framing:
					'Use vertical camera moves from project list to issue detail and then into the `Create Agent` handoff rather than showing the entire modal width at once.',
				safeZone:
					'Protect the selected issue, document preview label, and activation controls inside a stacked vertical safe zone with supporting details demoted to inserts.',
			},
		],
	},
	capturePlan: [
		{
			id: 'symphony-projects-browse',
			feature: 'Maestro Symphony Projects Browse',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes:
				'Capture the `Projects` tab with repository cards, search, filters, and issue counts in a real Maestro session.',
			required: true,
		},
		{
			id: 'symphony-issue-detail-preview',
			feature: 'Symphony Issue Detail And Document Preview',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes:
				'Capture one selected issue with `Available Issues`, `Blocked`, and the Auto Run document preview controls visible together.',
			required: true,
		},
		{
			id: 'symphony-create-agent-modal',
			feature: 'Symphony Create Agent',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes:
				'Capture the `Create Agent` handoff with provider selection and working directory ready to confirm.',
			required: true,
		},
		{
			id: 'symphony-setup-proof',
			feature: 'Symphony Setup Proof',
			mode: 'derived-asset',
			sourceRef: 'src/main/services/symphony-runner.ts',
			notes:
				'Represent the source-of-truth setup steps: clone, branch, empty commit, draft PR, and Auto Run doc staging.',
			required: true,
		},
		{
			id: 'symphony-active-proof',
			feature: 'Symphony Active Contribution',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes:
				'Capture the `Active` contribution card with status badge, elapsed time, token usage, and PR state.',
			required: true,
		},
		{
			id: 'symphony-history-stats-proof',
			feature: 'Symphony History And Stats',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes:
				'Capture `History` or `Stats` proof that contribution progress and milestones persist after activation.',
			required: true,
		},
	],
	assetPlaceholders: [
		{
			id: 'symphony-projects-hero',
			kind: 'live-capture',
			label: 'Projects browse hero capture',
			plannedSource: 'capture/live/symphony/projects-browse.mov',
			usage: 'Scenes 1 and 2 foundation for repository browsing and issue selection.',
			required: true,
		},
		{
			id: 'symphony-doc-preview-inset',
			kind: 'doc-capture',
			label: 'Issue document preview inset',
			plannedSource: 'capture/docs/symphony/issue-document-preview.png',
			usage: 'Scene 2 support asset for document preview readability in tighter crops.',
			required: true,
		},
		{
			id: 'symphony-create-agent-focus',
			kind: 'live-capture',
			label: 'Create Agent handoff capture',
			plannedSource: 'capture/live/symphony/create-agent.mov',
			usage: 'Scenes 3 and 4 activation shell and provider-selection beat.',
			required: true,
		},
		{
			id: 'symphony-automation-checklist',
			kind: 'motion-graphic',
			label: 'Automation proof checklist overlay',
			plannedSource: 'capture/derived/symphony/setup-checklist.json',
			usage:
				'Scene 4 source-of-truth visualization for clone, branch, doc staging, and draft PR setup.',
			required: true,
		},
		{
			id: 'symphony-active-card-proof',
			kind: 'live-capture',
			label: 'Active contribution proof capture',
			plannedSource: 'capture/live/symphony/active-card.mov',
			usage: 'Scene 5 hero proof that the contribution became a live Maestro object.',
			required: true,
		},
		{
			id: 'symphony-stats-proof',
			kind: 'live-capture',
			label: 'Stats and history proof capture',
			plannedSource: 'capture/live/symphony/stats-history.mov',
			usage: 'Scene 6 closing proof for milestones, history, and measurable contribution output.',
			required: true,
		},
	],
	terminology: [
		'Projects',
		'Active',
		'History',
		'Stats',
		'Start Symphony',
		'Create Agent',
		'Blocked',
		'Check PR Status',
		'Finalize PR',
	],
	sourceRefs: [
		'SYMPHONY_ISSUES.md',
		'src/main/services/symphony-runner.ts',
		'src/renderer/hooks/symphony/useSymphony.ts',
		'src/renderer/hooks/symphony/useSymphonyContribution.ts',
		'docs/research/features/symphony-feature-research.md',
		'docs/strategy/symphony-prototype-plan.md',
	],
	scenes: [
		{
			id: 'symphony-standalone-projects-browse',
			type: 'title-card',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'Projects',
			title: 'Browse contribution-ready issues in real repository context',
			body: 'Projects, issue counts, and maintainer context establish a live contribution inventory before any setup work begins.',
			durationInFrames: 180,
			captureIds: ['symphony-projects-browse'],
			assetPlaceholderIds: ['symphony-projects-hero'],
			storyboard: {
				sceneNumber: 1,
				purpose:
					'Establish contribution inventory and repository credibility before any setup begins.',
				onScreenCopy: [
					'Open-source work, already staged.',
					'`Projects` keeps issues, docs, and status together.',
				],
				visualComposition:
					'Wide modal pass across repository cards, category chips, search, and issue counts with one project selected.',
				uiStateShown:
					'`Maestro Symphony` on the `Projects` tab with repository metadata and issue totals visible.',
				userAction: 'Open `Maestro Symphony` and select a repository worth contributing to.',
				systemResponse:
					'The selected project locks in with maintainer context and clear issue volume.',
				motionStyle: 'Slow lateral drift with a deliberate push-in on the selected repository.',
				durationSeconds: 6,
			},
		},
		{
			id: 'symphony-standalone-issue-detail',
			type: 'feature-spotlight',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'Issue Detail',
			title: 'Issue detail and Auto Run docs stay visible before activation',
			body: '`Available Issues`, `Blocked`, and document preview keep the work scoped before the user hands anything off.',
			durationInFrames: 210,
			captureIds: ['symphony-projects-browse', 'symphony-issue-detail-preview'],
			assetPlaceholderIds: ['symphony-projects-hero', 'symphony-doc-preview-inset'],
			storyboard: {
				sceneNumber: 2,
				purpose:
					'Show the issue detail and Auto Run document preview before activation so the work feels concrete.',
				onScreenCopy: [
					'`Available Issues` and `Blocked` are visible before commit.',
					'Auto Run docs preview inside the same modal.',
				],
				visualComposition:
					'Split focus between issue detail, status grouping, and the document preview pane.',
				uiStateShown: 'Selected project detail with issue sections plus document preview controls.',
				userAction: 'Choose a specific issue and cycle through its attached documents.',
				systemResponse: 'The preview updates in place, keeping task context inside the same modal.',
				motionStyle:
					'Snap zoom into the selected issue with cursor-tracked emphasis on document changes.',
				durationSeconds: 7,
			},
		},
		{
			id: 'symphony-standalone-create-agent',
			type: 'capture-callout',
			surfaceId: 'symphony-create-agent',
			featureName: 'Maestro Symphony',
			accentLabel: 'Start Symphony',
			title: '`Start Symphony` hands the issue straight into `Create Agent`',
			body: 'Provider choice and working directory stay attached to the chosen issue so setup feels like continuation, not context switching.',
			durationInFrames: 240,
			captureIds: ['symphony-issue-detail-preview', 'symphony-create-agent-modal'],
			assetPlaceholderIds: ['symphony-create-agent-focus'],
			storyboard: {
				sceneNumber: 3,
				purpose: 'Turn browsing into a decisive handoff.',
				onScreenCopy: [
					'`Start Symphony` moves straight into `Create Agent`.',
					'Provider and working directory stay tied to the issue.',
				],
				visualComposition:
					'CTA click resolves into the `Create Agent` dialog with provider list and working directory fields in view.',
				uiStateShown: '`Start Symphony` transition into `Create Agent`.',
				userAction: 'Click `Start Symphony` on the chosen issue.',
				systemResponse: '`Create Agent` opens with issue-specific context already attached.',
				motionStyle: 'Fast modal morph with a short whip-pan between browse and setup states.',
				durationSeconds: 8,
			},
		},
		{
			id: 'symphony-standalone-setup-proof',
			type: 'capture-callout',
			surfaceId: 'symphony-create-agent',
			featureName: 'Maestro Symphony',
			accentLabel: 'Setup Proof',
			title: 'Maestro owns the clone, branch, doc staging, and draft PR setup',
			body: 'The activation beat reflects the current implementation path where setup creates an empty commit and draft PR before the run moves forward.',
			durationInFrames: 210,
			captureIds: ['symphony-create-agent-modal', 'symphony-setup-proof'],
			assetPlaceholderIds: ['symphony-create-agent-focus', 'symphony-automation-checklist'],
			storyboard: {
				sceneNumber: 4,
				purpose: 'Prove the orchestration Maestro performs during activation.',
				onScreenCopy: [
					'Clone. branch. stage docs. open draft PR.',
					'The current setup flow creates an empty commit and draft PR.',
				],
				visualComposition:
					'`Create Agent` confirmation paired with a concise checklist or progress rail showing setup milestones.',
				uiStateShown:
					'Setup proof state spanning clone, branch creation, Auto Run doc staging, and draft PR creation.',
				userAction: 'Confirm the provider and launch the run.',
				systemResponse:
					'Maestro performs the setup work and stages the contribution as a live run.',
				motionStyle: 'Staggered checklist reveals with a compact terminal-style pulse underneath.',
				durationSeconds: 7,
			},
		},
		{
			id: 'symphony-standalone-active-proof',
			type: 'feature-spotlight',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'Active',
			title: '`Active` turns the contribution into a live Maestro object',
			body: 'Status badges, elapsed time, token usage, and PR state prove the work is underway in product terms.',
			durationInFrames: 270,
			captureIds: ['symphony-active-proof'],
			assetPlaceholderIds: ['symphony-active-card-proof'],
			storyboard: {
				sceneNumber: 5,
				purpose: 'Show the contribution as a live Maestro object instead of a one-off dialog.',
				onScreenCopy: [
					'`Active` shows status, elapsed time, tokens, and PR state.',
					'The handoff is now running, not hypothetical.',
				],
				visualComposition:
					'Active contribution card hero with badges, progress details, PR state, and supporting metadata.',
				uiStateShown: '`Active` contribution state with status and progress proof.',
				userAction: 'Switch from setup proof into the live contribution view.',
				systemResponse: 'The issue now exists as a tracked contribution lane inside Maestro.',
				motionStyle: 'Card stack rise with badge flickers and a restrained progress sweep.',
				durationSeconds: 9,
			},
		},
		{
			id: 'symphony-standalone-history-stats',
			type: 'title-card',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'Stats',
			title: '`History` and `Stats` close with measurable contribution proof',
			body: 'Milestones and cumulative contribution metrics make the browse-to-contribute transformation visible without leaving Maestro.',
			durationInFrames: 240,
			captureIds: ['symphony-history-stats-proof'],
			assetPlaceholderIds: ['symphony-stats-proof'],
			storyboard: {
				sceneNumber: 6,
				purpose: 'Close with measurable proof that discovery became contribution history.',
				onScreenCopy: [
					'`History` and `Stats` turn one start click into measurable progress.',
					'Discovery became a contribution lane.',
				],
				visualComposition:
					'Resolve into milestone stats and history proof with emphasis on contribution continuity.',
				uiStateShown:
					'`History` or `Stats` proof state showing milestones, contribution totals, or review readiness.',
				userAction: 'Move to the proof surface that summarizes progress.',
				systemResponse:
					'Maestro shows cumulative contribution proof instead of leaving the story at setup.',
				motionStyle: 'Metric count-up and calm settle to finish on operational credibility.',
				durationSeconds: 8,
			},
		},
	],
});
