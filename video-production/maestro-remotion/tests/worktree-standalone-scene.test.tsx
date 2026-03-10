import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import { FeatureHeroScene } from '../src/scenes/FeatureHeroScene';
import { getCapturesForScene } from '../src/lib/timeline';

vi.mock('remotion', async () => {
	const actual = await vi.importActual<typeof import('remotion')>('remotion');

	return {
		...actual,
		useCurrentFrame: () => 72,
		useVideoConfig: () => ({
			fps: 30,
			width: 1920,
			height: 1080,
			durationInFrames: 1050,
			id: 'WorktreeSpinOffsStandalone',
		}),
	};
});

describe('Worktree standalone scene shell', () => {
	it('renders the worktree-specific stage rail, focus treatment, and animated comparison board for the opener', () => {
		const scene = worktreeSpinOffsStandaloneSpec.scenes[0];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 0,
				sceneCount: worktreeSpinOffsStandaloneSpec.scenes.length,
				spec: worktreeSpinOffsStandaloneSpec,
				captures: getCapturesForScene(worktreeSpinOffsStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('Current Beat');
		expect(markup).toContain('Before');
		expect(markup).toContain('After');
		expect(markup).toContain('Single checkout pressure');
		expect(markup).toContain('Parallel isolated lanes');
		expect(markup).toContain('Risk');
		expect(markup).toContain('Inventory');
		expect(markup).toContain('Proof');
	});

	it('renders the toggle scene with the dedicated focus callout outside the clipped surface frame', () => {
		const scene = worktreeSpinOffsStandaloneSpec.scenes[1];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 1,
				sceneCount: worktreeSpinOffsStandaloneSpec.scenes.length,
				spec: worktreeSpinOffsStandaloneSpec,
				captures: getCapturesForScene(worktreeSpinOffsStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('Enable isolated lane');
		expect(markup).toContain('Dispatch to a separate worktree');
	});
});
