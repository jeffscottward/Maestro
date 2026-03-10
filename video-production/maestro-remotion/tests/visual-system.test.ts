import { describe, expect, it } from 'vitest';

import { THEMES } from '../../../src/shared/themes';
import {
	DEFAULT_VISUAL_THEME_ID,
	MAESTRO_SURFACE_THEMES,
	MAESTRO_VISUAL_PRIMITIVE_IDS,
	REQUIRED_PRODUCT_LABELS,
	VISUAL_FALLBACK_SLOTS,
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
		]);
		expect(VISUAL_FALLBACK_SLOTS).toHaveLength(3);
		expect(
			VISUAL_FALLBACK_SLOTS.every((slot) => slot.sourcePath.startsWith('docs/screenshots/'))
		).toBe(true);
	});
});
