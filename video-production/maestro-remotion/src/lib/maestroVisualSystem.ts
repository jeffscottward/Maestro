import { THEMES } from '../../../../src/shared/themes';
import type { Theme, ThemeColors, ThemeId } from '../../../../src/shared/theme-types';

type MaestroSurfaceId = 'symphony' | 'director-notes' | 'worktree';

export const DEFAULT_VISUAL_THEME_ID: ThemeId = 'pedurple';

const createSurfaceTheme = (themeId: ThemeId, overrides: Partial<ThemeColors> = {}): Theme => ({
	...THEMES[themeId],
	colors: {
		...THEMES[themeId].colors,
		...overrides,
	},
});

export const MAESTRO_SURFACE_THEMES: Record<MaestroSurfaceId, Theme> = {
	symphony: THEMES[DEFAULT_VISUAL_THEME_ID],
	'director-notes': createSurfaceTheme('tokyo-night', {
		accent: '#b59aff',
		accentDim: 'rgba(181, 154, 255, 0.18)',
		accentText: '#cebaff',
		textDim: '#a2acd4',
	}),
	worktree: createSurfaceTheme('tokyo-night', {
		accent: '#b28cff',
		accentDim: 'rgba(178, 140, 255, 0.16)',
		accentText: '#d7c4ff',
		textDim: '#96a0cb',
	}),
};

export const maestroVisualTheme = MAESTRO_SURFACE_THEMES.symphony;

export const MAESTRO_VISUAL_PRIMITIVE_IDS = [
	'modal-shell',
	'tab-strip',
	'stat-card',
	'activity-row',
	'autorun-document-list',
	'worktree-controls',
	'terminal-block',
	'cursor',
	'annotation-surface',
	'fallback-slot',
] as const;

export const REQUIRED_PRODUCT_LABELS = [
	'Maestro Symphony',
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
	"Director's Notes",
	'Unified History',
	'AI Overview',
	'Auto Run',
	'Run in Worktree',
	'Dispatch to a separate worktree',
	'Create New Worktree',
	'Base Branch',
	'Worktree Branch Name',
	'Automatically create PR when complete',
	'Create Pull Request',
] as const;

export const SYMPHONY_TABS = ['Projects', 'Active', 'History', 'Stats'] as const;
export const DIRECTOR_NOTES_TABS = ['Help', 'Unified History', 'AI Overview'] as const;
export const WORKTREE_TABS = ['Auto Run', 'Run in Worktree', 'History'] as const;

export const DIRECTOR_NOTES_STATS = [
	{ label: 'Agents', value: '27', tone: 'accent' as const },
	{ label: 'Sessions', value: '203', tone: 'neutral' as const },
	{ label: 'AUTO', value: '147', tone: 'warning' as const },
];

export const AUTO_RUN_DOCUMENTS = [
	{ name: 'Testing/1_ANALYZE.md', tasks: '5 tasks', active: false },
	{ name: 'Testing/2_FIND_GAPS.md', tasks: '1 task', active: false },
	{ name: 'Testing/3_EVALUATE.md', tasks: '1 task', active: false },
	{ name: 'Testing/4_IMPLEMENT.md', tasks: '8 tasks', active: false },
	{ name: 'Testing/5_PROGRESS.md', tasks: '5 tasks', active: true },
] as const;

export const TERMINAL_PLAN_LINES = [
	'Phase 1: Install Dependencies and Create',
	'Base xterm.js Component',
	'',
	'Overview',
	'This phase establishes the foundation for terminal',
	'integration by creating a reusable component that',
	'wraps xterm.js with proper lifecycle management.',
] as const;

export type VisualFallbackSlot = {
	id: string;
	label: string;
	sourcePath: string;
	mediaType: 'screenshot' | 'video';
	reason: string;
};

export const VISUAL_FALLBACK_SLOTS = [
	{
		id: 'director-notes-history',
		label: "Director's Notes",
		sourcePath: 'docs/screenshots/directors-notes-history.png',
		mediaType: 'screenshot',
		reason: 'Use the exact Unified History density until the full history table is reconstructed.',
	},
	{
		id: 'director-notes-ai-overview',
		label: 'AI Overview',
		sourcePath: 'docs/screenshots/directors-notes-ai-overview.png',
		mediaType: 'screenshot',
		reason:
			'Preserves the rendered markdown synopsis until the AI Overview panel is rebuilt exactly.',
	},
	{
		id: 'autorun-worktree',
		label: 'Run in Worktree',
		sourcePath: 'docs/screenshots/autorun-worktree.png',
		mediaType: 'screenshot',
		reason:
			'Keeps the worktree form exact while later phases replace this slot with a live rebuild.',
	},
	{
		id: 'git-worktree-configuration',
		label: 'Git Worktree Configuration',
		sourcePath: 'docs/screenshots/git-worktree-configuration.png',
		mediaType: 'screenshot',
		reason:
			'Anchors the exact worktree configuration density until the later feature pass deepens it.',
	},
	{
		id: 'git-worktree-list',
		label: 'Git Worktree List',
		sourcePath: 'docs/screenshots/git-worktree-list.png',
		mediaType: 'screenshot',
		reason: 'Keeps the worktree inventory exact until the list view is reconstructed row-for-row.',
	},
	{
		id: 'symphony-details',
		label: 'Maestro Symphony',
		sourcePath: 'docs/screenshots/symphony-details.png',
		mediaType: 'screenshot',
		reason:
			'Uses the older issue-detail screenshot as a visual reference until the full split view is recreated from structured data.',
	},
	{
		id: 'symphony-create-agent',
		label: 'Create Symphony Agent',
		sourcePath: 'docs/screenshots/symphony-create-agent.png',
		mediaType: 'screenshot',
		reason:
			'Uses the older create-agent screenshot as a visual reference while the current `Create Symphony Agent` form continues to be rebuilt in-code.',
	},
] as const satisfies readonly VisualFallbackSlot[];

export type MaestroVisualTheme = Theme;

export const createFallbackSlot = (slot: VisualFallbackSlot): VisualFallbackSlot => slot;

export const getMaestroTheme = (themeId: ThemeId = DEFAULT_VISUAL_THEME_ID): Theme =>
	THEMES[themeId];
