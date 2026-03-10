import { createProductionSpec } from './shared';

export const symphonyStandaloneSpec = createProductionSpec({
	id: 'SymphonyStandalone',
	featureName: 'Maestro Symphony',
	title: 'Maestro Symphony standalone production storyboard',
	description:
		'45-second standalone production spec covering the browse-to-coordinated-contribution Symphony workflow.',
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
					'Use vertical camera moves from project list to issue detail and then into the `Create Symphony Agent` handoff rather than showing the entire modal width at once.',
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
			feature: 'Symphony Create Symphony Agent',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/AgentCreationDialog.tsx',
			notes:
				'Capture the `Create Symphony Agent` dialog with provider selection, session naming, and working directory ready to confirm.',
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
				'Capture or reconstruct the current `Active` contribution card with status badge, draft PR state, document progress, token usage, sync affordance, and review readiness.',
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
			kind: 'doc-capture',
			label: 'Projects browse reference capture',
			plannedSource: 'capture/docs/symphony/projects-browse-reference.png',
			usage:
				'Scenes 1 and 2 fallback reference for repository browsing and issue selection while the composition stays reconstruction-first.',
			required: true,
		},
		{
			id: 'symphony-doc-preview-inset',
			kind: 'doc-capture',
			label: 'Issue document preview inset',
			plannedSource: 'capture/docs/symphony/issue-detail-reference.png',
			usage:
				'Scene 2 support asset for document preview readability and split-pane issue detail fidelity in tighter crops.',
			required: true,
		},
		{
			id: 'symphony-create-agent-focus',
			kind: 'doc-capture',
			label: 'Create Symphony Agent handoff reference',
			plannedSource: 'capture/docs/symphony/create-agent-reference.png',
			usage:
				'Scenes 3 and 4 fallback reference for the activation shell while the dialog itself is reconstructed to current product terminology.',
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
			kind: 'doc-capture',
			label: 'Active contribution proof reference',
			plannedSource: 'capture/docs/symphony/active-card-reference.png',
			usage:
				'Scene 5 fallback reference for contribution-card layout and pacing while the rendered state follows the current draft-PR-aware product behavior.',
			required: true,
		},
		{
			id: 'symphony-history-proof',
			kind: 'doc-capture',
			label: 'History proof reference',
			plannedSource: 'capture/docs/symphony/history-proof-reference.png',
			usage:
				'Scene 6 fallback reference for completed contribution rows and merged-state proof before the closing stats settle.',
			required: true,
		},
		{
			id: 'symphony-stats-proof',
			kind: 'doc-capture',
			label: 'Stats proof reference',
			plannedSource: 'capture/docs/symphony/stats-proof-reference.png',
			usage:
				'Scene 6 closing proof for milestones, token donation, and measurable contribution output.',
			required: true,
		},
	],
	terminology: [
		'Projects',
		'Active',
		'History',
		'Stats',
		'Start Symphony',
		'Create Symphony Agent',
		'Create Agent',
		'Available Issues',
		'Blocked',
		'Draft PR',
		'Check PR Status',
		'Finalize PR',
		'Ready for Review',
	],
	sourceRefs: [
		'SYMPHONY_ISSUES.md',
		'src/main/services/symphony-runner.ts',
		'src/renderer/components/AgentCreationDialog.tsx',
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
			title: 'Browse contribution-ready issues inside one coordinated Symphony surface',
			body: 'The full tab strip, issue counts, and maintainer context establish a live contribution inventory before any setup work begins.',
			durationInFrames: 180,
			captureIds: ['symphony-projects-browse'],
			assetPlaceholderIds: ['symphony-projects-hero'],
			storyboard: {
				sceneNumber: 1,
				purpose:
					'Establish the full Symphony surface before any setup begins so the workflow reads as coordinated, not scattered.',
				onScreenCopy: [
					'`Projects`, `Active`, `History`, and `Stats` live in one place.',
					'Contribution discovery starts inside Maestro.',
				],
				visualComposition:
					'Wide modal pass across the tab strip, search, category chips, and issue-counted repository cards with one project selected.',
				uiStateShown:
					'`Maestro Symphony` open on `Projects` with the wider tab structure and repository metadata visible.',
				userAction: 'Open `Maestro Symphony` and focus a repository worth contributing to.',
				systemResponse:
					'The selected project locks in with maintainer context and visible contribution inventory.',
				motionStyle:
					'Slow lateral drift with a deliberate push-in on the selected repository and tab strip.',
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
					'`Available Issues` and `Blocked` stay visible before commit.',
					'Auto Run docs preview inside the same modal.',
				],
				visualComposition:
					'Split focus between issue detail, status grouping, document dropdown, and markdown preview.',
				uiStateShown: 'Selected project detail with issue sections plus document preview controls.',
				userAction: 'Choose a specific issue and cycle through its attached documents.',
				systemResponse:
					'The preview updates in place, keeping scope and status inside the same modal.',
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
			accentLabel: 'Create Symphony Agent',
			title: '`Start Symphony` clears prerequisites and lands in `Create Symphony Agent`',
			body: 'Provider choice, session name, and working directory stay attached to the chosen issue so setup feels like continuation, not context switching.',
			durationInFrames: 240,
			captureIds: ['symphony-issue-detail-preview', 'symphony-create-agent-modal'],
			assetPlaceholderIds: ['symphony-create-agent-focus'],
			storyboard: {
				sceneNumber: 3,
				purpose: 'Turn browsing into a guarded handoff that still feels immediate.',
				onScreenCopy: [
					'`Start Symphony` clears prerequisites before `Create Symphony Agent`.',
					'The issue, provider, and working directory stay attached.',
				],
				visualComposition:
					'CTA click resolves through the prerequisite gate and into the `Create Symphony Agent` dialog with provider list, session name, and working directory fields in view.',
				uiStateShown:
					'`Start Symphony` transition into the prerequisite checks and `Create Symphony Agent`.',
				userAction: 'Click `Start Symphony` on the chosen issue and confirm the prerequisites.',
				systemResponse:
					'The agent-creation dialog opens with issue-specific context already attached.',
				motionStyle:
					'Fast modal morph with a short interlock pause on the prerequisite state before the dialog lands.',
				durationSeconds: 8,
			},
		},
		{
			id: 'symphony-standalone-setup-proof',
			type: 'capture-callout',
			surfaceId: 'symphony-create-agent',
			featureName: 'Maestro Symphony',
			accentLabel: 'Setup Proof',
			title: '`Create Agent` launches clone, branch, `Auto Run Docs`, and draft PR setup',
			body: 'The activation beat reflects the current implementation path where setup creates an empty commit and draft PR before the run moves forward.',
			durationInFrames: 210,
			captureIds: ['symphony-create-agent-modal', 'symphony-setup-proof'],
			assetPlaceholderIds: ['symphony-create-agent-focus', 'symphony-automation-checklist'],
			storyboard: {
				sceneNumber: 4,
				purpose: 'Prove the orchestration Maestro performs during activation.',
				onScreenCopy: [
					'`Create Agent` launches clone, branch, `Auto Run Docs`, and draft PR setup.',
					'The current setup flow creates an empty commit and draft PR.',
				],
				visualComposition:
					'`Create Symphony Agent` confirmation paired with a concise checklist or progress rail showing setup milestones.',
				uiStateShown:
					'Setup proof state spanning dialog confirmation, branch creation, `Auto Run Docs` staging, and draft PR creation.',
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
			title: '`Active` turns the contribution into a live Maestro object with draft PR state',
			body: 'Status badges, draft PR visibility, progress, and token usage prove the work is underway in product terms.',
			durationInFrames: 270,
			captureIds: ['symphony-active-proof'],
			assetPlaceholderIds: ['symphony-active-card-proof'],
			storyboard: {
				sceneNumber: 5,
				purpose: 'Show the contribution as a live Maestro object instead of a one-off dialog.',
				onScreenCopy: [
					'`Active` shows `Running`, draft PR state, progress, and token usage.',
					'`Check PR Status` keeps the review lane current.',
				],
				visualComposition:
					'Active contribution card hero with status badge, draft PR link, progress details, elapsed time, token usage, and review-state affordances.',
				uiStateShown: '`Active` contribution state with current-status and PR proof.',
				userAction: 'Switch from setup proof into the live contribution view.',
				systemResponse:
					'The issue now exists as a tracked contribution lane with visible PR state and progress.',
				motionStyle:
					'Card stack rise with badge flickers, a restrained progress sweep, and a short sync pulse.',
				durationSeconds: 9,
			},
		},
		{
			id: 'symphony-standalone-history-stats',
			type: 'title-card',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'History + Stats',
			title: '`History` and `Stats` keep contribution proof after `Active`',
			body: 'Completed contribution proof, milestones, and cumulative contribution metrics make the browse-to-contribute transformation visible without leaving Maestro.',
			durationInFrames: 240,
			captureIds: ['symphony-history-stats-proof'],
			assetPlaceholderIds: ['symphony-history-proof', 'symphony-stats-proof'],
			storyboard: {
				sceneNumber: 6,
				purpose: 'Close with measurable proof that discovery became durable contribution output.',
				onScreenCopy: [
					'`History` and `Stats` keep contribution proof after `Active`.',
					'One start click becomes a lasting record.',
				],
				visualComposition:
					'Resolve into history totals, completed contribution proof, and achievement or streak stats with emphasis on continuity.',
				uiStateShown:
					'`History` and `Stats` proof state showing milestones, contribution totals, and post-run evidence.',
				userAction: 'Move to the proof surfaces that summarize the outcome.',
				systemResponse:
					'Maestro shows cumulative contribution proof instead of leaving the story at setup.',
				motionStyle: 'Metric count-up and calm settle to finish on operational credibility.',
				durationSeconds: 8,
			},
		},
	],
});
