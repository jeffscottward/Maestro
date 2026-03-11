import { createProductionSpec } from './shared';

export const worktreeSpinOffsStandaloneSpec = createProductionSpec({
	id: 'WorktreeSpinOffsStandalone',
	featureName: 'Run in Worktree',
	title: 'Auto Run Worktree Spin-offs standalone production storyboard',
	description:
		'35-second standalone production spec covering the single-branch bottleneck, Auto Run worktree isolation, and cleaner review-oriented follow-through in a text-led final edit.',
	fps: 30,
	runtimeSeconds: 35,
	aspectRatioIntent: {
		primary: '16:9',
		adaptations: [
			{
				ratio: '1:1',
				framing:
					'Center the worktree toggle, branch fields, and PR option while side lists compress into stacked callout blocks.',
				safeZone:
					'Keep `Run in Worktree`, `Dispatch to a separate worktree`, `Base Branch`, and `Worktree Branch Name` inside the square crop at all times.',
			},
			{
				ratio: '9:16',
				framing:
					'Use vertical storytelling from Auto Run queue to toggle row to branch form, then close on terminal proof without attempting to keep the full modal width visible.',
				safeZone:
					'Protect the toggle state, branch form, path preview, and terminal proof inside a tall central column with list or config context as lower-priority inserts.',
			},
		],
	},
	capturePlan: [
		{
			id: 'worktree-batch-runner',
			feature: 'Auto Run Batch Runner',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/BatchRunnerModal.tsx',
			notes:
				'Capture the Auto Run launch surface in a git-backed session before the worktree section becomes the focal point.',
			required: true,
		},
		{
			id: 'worktree-toggle-enabled',
			feature: 'Run In Worktree Toggle',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/WorktreeRunSection.tsx',
			notes:
				'Capture the `Run in Worktree` section opening as `Dispatch to a separate worktree` is enabled.',
			required: true,
		},
		{
			id: 'worktree-create-new-form',
			feature: 'Create New Worktree Form',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/WorktreeRunSection.tsx',
			notes:
				'Capture `Create New Worktree`, `Base Branch`, `Worktree Branch Name`, and path preview in one readable state.',
			required: true,
		},
		{
			id: 'worktree-pr-intent',
			feature: 'Worktree PR Intent',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/WorktreeRunSection.tsx',
			notes:
				'Capture `Automatically create PR when complete` enabled alongside the rest of the create-new form.',
			required: true,
		},
		{
			id: 'worktree-inventory-proof',
			feature: 'Worktree Inventory Proof',
			mode: 'live-capture',
			sourceRef: 'src/renderer/components/WorktreeConfigModal.tsx',
			notes:
				'Capture `Open in Maestro`, `Available Worktrees`, or supporting inventory proof that the destination is real and selectable.',
			required: true,
		},
		{
			id: 'worktree-terminal-proof',
			feature: 'Worktree Terminal Proof',
			mode: 'derived-asset',
			sourceRef: 'src/renderer/components/WorktreeRunSection.tsx',
			notes:
				'Represent the launched run with isolated branch, directory, and clean-parent-checkout proof in terminal-oriented visuals.',
			required: true,
		},
	],
	assetPlaceholders: [
		{
			id: 'worktree-autorun-context',
			kind: 'doc-capture',
			label: 'Auto Run launch context capture',
			plannedSource: 'capture/docs/worktree/autorun-worktree-reference.png',
			usage: 'Scene 1 context for the risk setup.',
			required: true,
		},
		{
			id: 'worktree-toggle-focus',
			kind: 'doc-capture',
			label: 'Run in Worktree toggle capture',
			plannedSource: 'capture/docs/worktree/autorun-worktree-reference.png',
			usage: 'Scene 2 reveal of the isolation control surface.',
			required: true,
		},
		{
			id: 'worktree-create-form',
			kind: 'doc-capture',
			label: 'Create worktree form capture',
			plannedSource: 'capture/docs/worktree/autorun-worktree-reference.png',
			usage: 'Scenes 3 and 4 exact branch, path, and PR configuration beats.',
			required: true,
		},
		{
			id: 'worktree-inventory-panel',
			kind: 'doc-capture',
			label: 'Worktree inventory capture',
			plannedSource: 'capture/docs/worktree/worktree-inventory-reference.png',
			usage: 'Scene 5 proof that the isolated worktree destination exists inside Maestro.',
			required: true,
		},
		{
			id: 'worktree-configuration-context',
			kind: 'doc-capture',
			label: 'Worktree configuration support capture',
			plannedSource: 'capture/docs/worktree/worktree-configuration-reference.png',
			usage:
				'Scene 5 supporting directory and auto-detect context so the inventory proof stays anchored in real Maestro settings.',
			required: true,
		},
		{
			id: 'worktree-terminal-card',
			kind: 'motion-graphic',
			label: 'Terminal and branch proof card',
			plannedSource: 'capture/derived/worktree/terminal-proof.json',
			usage: 'Scene 6 operational follow-through and clean-parent-checkout close.',
			required: true,
		},
	],
	terminology: [
		'Auto Run',
		'Run in Worktree',
		'Dispatch to a separate worktree',
		'Open in Maestro',
		'Available Worktrees',
		'Create New Worktree',
		'Base Branch',
		'Worktree Branch Name',
		'Automatically create PR when complete',
		'Create Pull Request',
		'Worktree Directory',
	],
	sourceRefs: [
		'src/renderer/components/BatchRunnerModal.tsx',
		'src/renderer/components/WorktreeRunSection.tsx',
		'src/renderer/components/WorktreeConfigModal.tsx',
		'src/renderer/components/CreateWorktreeModal.tsx',
		'src/renderer/hooks/batch/useWorktreeManager.ts',
		'docs/autorun-playbooks.md',
		'docs/git-worktrees.md',
		'docs/research/features/worktree-spin-offs-feature-research.md',
		'docs/strategy/worktree-spin-offs-prototype-plan.md',
	],
	scenes: [
		{
			id: 'worktree-standalone-risk',
			type: 'title-card',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'Auto Run',
			title: 'One busy checkout should not bottleneck Auto Run',
			body: 'The open frames the product problem as a live branch bottleneck, not a generic git lecture.',
			durationInFrames: 150,
			captureIds: ['worktree-batch-runner'],
			assetPlaceholderIds: ['worktree-autorun-context'],
			storyboard: {
				sceneNumber: 1,
				purpose: 'Frame the single-branch bottleneck inside the real Auto Run workflow.',
				onScreenCopy: [
					'One busy checkout should not bottleneck Auto Run.',
					'Worktree isolation opens a safer parallel lane.',
				],
				visualComposition:
					'Batch runner modal with Auto Run context visible before the worktree section takes focus.',
				uiStateShown: 'Auto Run run-launch surface in a git-backed session.',
				userAction: 'Open the Auto Run run launcher for a git-backed repository.',
				systemResponse:
					'`Run in Worktree` appears as the built-in way to move the run off the busy parent checkout.',
				motionStyle: 'Tight reveal from document list into the lower configuration surface.',
				durationSeconds: 5,
			},
		},
		{
			id: 'worktree-standalone-toggle',
			type: 'capture-callout',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'Dispatch',
			title: '`Dispatch to a separate worktree` makes the isolation choice explicit',
			body: 'The control surface feels native to Auto Run because the isolation toggle lives inside the same launch flow.',
			durationInFrames: 150,
			captureIds: ['worktree-toggle-enabled'],
			assetPlaceholderIds: ['worktree-toggle-focus'],
			storyboard: {
				sceneNumber: 2,
				purpose: 'Reveal the isolation controls as a native part of Auto Run.',
				onScreenCopy: [
					'`Run in Worktree` lives inside Auto Run.',
					'`Dispatch to a separate worktree` makes the isolation choice explicit.',
				],
				visualComposition:
					'Center the toggle row and section expansion so the control change reads instantly.',
				uiStateShown: '`Run in Worktree` section expanding from collapsed to enabled.',
				userAction: 'Enable `Dispatch to a separate worktree`.',
				systemResponse: 'The section opens and defaults into `Create New Worktree`.',
				motionStyle: 'Short vertical expansion with a crisp control-state flash.',
				durationSeconds: 5,
			},
		},
		{
			id: 'worktree-standalone-create-form',
			type: 'feature-spotlight',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'Create New',
			title: '`Create New Worktree` starts with clear branch and path defaults',
			body: 'Base branch, generated worktree branch name, and path preview stay readable enough to trust the default flow.',
			durationInFrames: 210,
			captureIds: ['worktree-create-new-form'],
			assetPlaceholderIds: ['worktree-create-form'],
			storyboard: {
				sceneNumber: 3,
				purpose: 'Show the exact create-new workflow the product ships today.',
				onScreenCopy: [
					'`Create New Worktree` defaults on.',
					'`Base Branch`, `Worktree Branch Name`, and path preview stay readable.',
				],
				visualComposition:
					'Keep the branch fields, generated name, and path preview all readable at once.',
				uiStateShown:
					'Create-new worktree mode with `Base Branch`, `Worktree Branch Name`, and directory preview.',
				userAction: 'Inspect or edit the suggested branch inputs.',
				systemResponse:
					'Maestro proposes a sane starting branch, generated worktree branch name, and target path.',
				motionStyle: 'Guided pan across the form with inline field highlights.',
				durationSeconds: 7,
			},
		},
		{
			id: 'worktree-standalone-pr-intent',
			type: 'capture-callout',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'PR Ready',
			title: '`Automatically create PR when complete` keeps review attached',
			body: 'Isolation is more credible when the viewer can see branch, directory, and review intent in one frame before the run starts.',
			durationInFrames: 180,
			captureIds: ['worktree-create-new-form', 'worktree-pr-intent'],
			assetPlaceholderIds: ['worktree-create-form'],
			storyboard: {
				sceneNumber: 4,
				purpose: 'Add review handoff proof to the isolation story.',
				onScreenCopy: [
					'`Automatically create PR when complete` keeps review attached.',
					'Branch, path, and PR intent stay visible together.',
				],
				visualComposition:
					'Stay on the same form but shift emphasis to the PR checkbox and resulting configuration clarity.',
				uiStateShown: 'Create-new mode with PR option enabled and path preview still visible.',
				userAction: 'Enable `Automatically create PR when complete`.',
				systemResponse:
					'The run is now configured for isolated execution and review handoff in one step.',
				motionStyle: 'Checkbox snap plus restrained overlay callouts on branch and path.',
				durationSeconds: 6,
			},
		},
		{
			id: 'worktree-standalone-inventory',
			type: 'feature-spotlight',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'Inventory',
			title: '`Open in Maestro` and `Available Worktrees` prove the destination is real',
			body: 'The feature earns trust when the isolated target is visible as a real directory and agent destination, not just a form promise.',
			durationInFrames: 180,
			captureIds: ['worktree-inventory-proof'],
			assetPlaceholderIds: ['worktree-inventory-panel', 'worktree-configuration-context'],
			storyboard: {
				sceneNumber: 5,
				purpose: 'Prove the isolated worktree has its own tracked destination inside Maestro.',
				onScreenCopy: [
					'`Open in Maestro` and `Available Worktrees` show the isolated target.',
					'Docs stay with the parent agent; the branch moves to the worktree.',
				],
				visualComposition:
					'Show worktree inventory and supporting configuration proof without leaving the product frame.',
				uiStateShown: 'Open or available worktree inventory with supporting config context.',
				userAction: 'Inspect the available destination or open a worktree from the list.',
				systemResponse:
					'The isolated target is visible as a real directory and agent destination, not an abstract promise.',
				motionStyle: 'Layered list reveal with a calm rack focus between sections.',
				durationSeconds: 6,
			},
		},
		{
			id: 'worktree-standalone-terminal-proof',
			type: 'title-card',
			surfaceId: 'worktree-terminal',
			featureName: 'Run in Worktree',
			accentLabel: 'Follow-Through',
			title: 'Auto Run keeps the parent checkout clean and the review path clearer',
			body: 'The close resolves on safer parallel work: same repo context, isolated execution, and no branch contamination in the parent session.',
			durationInFrames: 180,
			captureIds: ['worktree-terminal-proof'],
			assetPlaceholderIds: ['worktree-terminal-card'],
			storyboard: {
				sceneNumber: 6,
				purpose: 'Finish on execution proof and a clean parent checkout.',
				onScreenCopy: [
					'Auto Run runs in the isolated branch while the main checkout stays clean.',
					'Parallel work keeps a cleaner review path.',
				],
				visualComposition:
					'Terminal feedback and worktree proof close the story on operational follow-through.',
				uiStateShown: 'Run launched in the worktree with terminal and branch context visible.',
				userAction: 'Start the run after confirming worktree settings.',
				systemResponse:
					'Maestro executes the Auto Run in the isolated branch and directory while preserving the parent context.',
				motionStyle: 'Terminal-led cadence with a final settle on the isolated branch state.',
				durationSeconds: 6,
			},
		},
	],
});
