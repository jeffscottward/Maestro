import { describe, expect, it } from 'vitest';

import { THEMES } from '../../../src/shared/themes';
import {
	DEFAULT_VISUAL_THEME_ID,
	DIRECTOR_NOTES_TABS,
	MAESTRO_SURFACE_THEMES,
	MAESTRO_VISUAL_PRIMITIVE_IDS,
	REQUIRED_PRODUCT_LABELS,
	SYMPHONY_TABS,
	VISUAL_FALLBACK_SLOTS,
	WORKTREE_TABS,
	maestroVisualTheme,
} from '../src/lib/maestroVisualSystem';

describe('Maestro visual system', () => {
	it('reuses the canonical theme token structure from src/shared/themes.ts for every surface', () => {
		const expectedColorKeys = Object.keys(THEMES.dracula.colors);

		expect(maestroVisualTheme).toBe(MAESTRO_SURFACE_THEMES.symphony);
		expect(maestroVisualTheme).toBe(THEMES[DEFAULT_VISUAL_THEME_ID]);

		for (const theme of Object.values(MAESTRO_SURFACE_THEMES)) {
			expect(Object.keys(theme.colors)).toEqual(expectedColorKeys);
		}
	});

	it('defines the full primitive set needed for reconstruction work', () => {
		expect(MAESTRO_VISUAL_PRIMITIVE_IDS).toEqual([
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
		]);
	});

	it('preserves required product labels and explicit screenshot fallback slots', () => {
		expect(REQUIRED_PRODUCT_LABELS).toEqual([
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
		]);
		expect(SYMPHONY_TABS).toEqual(['Projects', 'Active', 'History', 'Stats']);
		expect(DIRECTOR_NOTES_TABS).toEqual(['Help', 'Unified History', 'AI Overview']);
		expect(WORKTREE_TABS).toEqual(['Auto Run', 'Run in Worktree', 'History']);
		expect(VISUAL_FALLBACK_SLOTS).toHaveLength(7);
		expect(
			VISUAL_FALLBACK_SLOTS.every((slot) => slot.sourcePath.startsWith('docs/screenshots/'))
		).toBe(true);
		expect(VISUAL_FALLBACK_SLOTS.find((slot) => slot.id === 'symphony-create-agent')).toMatchObject(
			{
				label: 'Create Symphony Agent',
			}
		);
	});
});
