import { createPrototypeSpec } from './shared';

export const worktreeSpinOffsPrototypeSpec = createPrototypeSpec({
	id: 'WorktreeSpinOffsPrototype',
	featureName: 'Run in Worktree',
	title: 'Run in Worktree prototype',
	description:
		'Standalone worktree stub focused on Auto Run isolation, worktree creation, and PR-oriented follow-through.',
	fps: 30,
	runtimeSeconds: 6,
	capturePlan: [
		{
			id: 'autorun-worktree',
			feature: 'Run in Worktree',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/autorun-worktree.png',
			notes: 'Keep the exact Auto Run worktree form visible beside the reconstructed controls.',
			required: true,
		},
		{
			id: 'git-worktree-configuration',
			feature: 'Git Worktree Configuration',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/git-worktree-configuration.png',
			notes: 'Preserve the settings density for later layout matching.',
			required: true,
		},
		{
			id: 'git-worktree-list',
			feature: 'Git Worktree List',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/git-worktree-list.png',
			notes: 'Use the list screenshot to anchor later branching and cleanup flows.',
			required: false,
		},
		{
			id: 'worktree-run-section',
			feature: 'Run in Worktree Controls',
			mode: 'reconstructed-ui',
			sourceRef: 'src/renderer/components/WorktreeRunSection.tsx',
			notes: 'Use the real toggle semantics and branch naming copy from the app code.',
			required: true,
		},
	],
	scenes: [
		{
			id: 'worktree-dispatch-overview',
			type: 'title-card',
			surfaceId: 'worktree-dispatch',
			featureName: 'Run in Worktree',
			accentLabel: 'Auto Run',
			title: 'Dispatch to a separate worktree keeps long runs off the main checkout',
			body: 'The stub keeps Create New Worktree, Base Branch, Worktree Branch Name, and Automatically create PR when complete in one product-specific flow instead of abstract branch-management copy.',
			durationInFrames: 90,
			captureIds: ['worktree-run-section', 'autorun-worktree'],
		},
		{
			id: 'worktree-follow-through',
			type: 'capture-callout',
			surfaceId: 'worktree-terminal',
			featureName: 'Dispatch to a separate worktree',
			accentLabel: 'Follow-through',
			title: 'The prototype follows the run through terminal output and worktree state',
			body: 'Auto Run documents, terminal feedback, and the later git worktree list all stay connected so the next phases can deepen the execution loop without changing composition IDs.',
			durationInFrames: 90,
			captureIds: ['worktree-run-section', 'git-worktree-configuration', 'git-worktree-list'],
		},
	],
});
