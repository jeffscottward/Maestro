import { describe, expect, it } from 'vitest';

import {
	directorNotesStandaloneSpec,
	symphonyStandaloneSpec,
	worktreeSpinOffsStandaloneSpec,
} from '../src/data/specs';
import {
	createVideoCompositionMetadata,
	getSceneShellLayout,
	getStandaloneCompositionMetadata,
} from '../src/lib/aspect-ratio-adaptation';

describe('aspect-ratio adaptation', () => {
	it('creates master, square, and vertical composition metadata for every standalone feature', () => {
		expect(
			getStandaloneCompositionMetadata(symphonyStandaloneSpec).map((metadata) => ({
				id: metadata.compositionId,
				ratio: metadata.aspectRatio,
				dimensions: metadata.dimensions,
			}))
		).toEqual([
			{
				id: 'SymphonyStandalone',
				ratio: '16:9',
				dimensions: { width: 1920, height: 1080 },
			},
			{
				id: 'SymphonyStandaloneSquare',
				ratio: '1:1',
				dimensions: { width: 1080, height: 1080 },
			},
			{
				id: 'SymphonyStandaloneVertical',
				ratio: '9:16',
				dimensions: { width: 1080, height: 1920 },
			},
		]);

		expect(createVideoCompositionMetadata(directorNotesStandaloneSpec, '1:1').safeZone).toContain(
			'Unified History'
		);
		expect(
			createVideoCompositionMetadata(worktreeSpinOffsStandaloneSpec, '9:16').framing
		).toContain('vertical storytelling');
	});

	it('switches from the authored wide shell into stacked and portrait-safe scene layouts', () => {
		expect(
			getSceneShellLayout({
				specId: 'SymphonyStandalone',
				sceneId: 'symphony-standalone-issue-detail',
				aspectRatio: '16:9',
			})
		).toMatchObject({
			mode: 'split',
			noteColumns: 2,
			supportColumns: 2,
			surfacePriority: 'balanced',
		});

		expect(
			getSceneShellLayout({
				specId: 'SymphonyStandalone',
				sceneId: 'symphony-standalone-issue-detail',
				aspectRatio: '1:1',
			})
		).toMatchObject({
			mode: 'stacked',
			noteColumns: 2,
			supportColumns: 2,
			surfacePriority: 'stage-heavy',
		});

		expect(
			getSceneShellLayout({
				specId: 'SymphonyStandalone',
				sceneId: 'symphony-standalone-issue-detail',
				aspectRatio: '9:16',
			})
		).toMatchObject({
			mode: 'portrait',
			noteColumns: 1,
			supportColumns: 1,
			surfacePriority: 'stage-heavy',
		});
	});

	it('raises stage priority for dense history and form-heavy worktree scenes on narrow variants', () => {
		const directorLayout = getSceneShellLayout({
			specId: 'DirectorNotesStandalone',
			sceneId: 'director-notes-standalone-history',
			aspectRatio: '9:16',
		});
		const worktreeLayout = getSceneShellLayout({
			specId: 'WorktreeSpinOffsStandalone',
			sceneId: 'worktree-standalone-create-form',
			aspectRatio: '9:16',
		});

		expect(directorLayout.surfacePriority).toBe('stage-heavy');
		expect(directorLayout.stageMinHeight).toBeGreaterThan(560);
		expect(worktreeLayout.surfacePriority).toBe('stage-heavy');
		expect(worktreeLayout.stageMinHeight).toBeGreaterThan(560);
	});
});
