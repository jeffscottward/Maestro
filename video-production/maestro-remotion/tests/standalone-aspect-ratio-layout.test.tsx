import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { directorNotesStandaloneSpec, symphonyStandaloneSpec } from '../src/data/specs';
import { getCapturesForScene } from '../src/lib/timeline';
import { FeatureHeroScene } from '../src/scenes/FeatureHeroScene';
import { createVideoCompositionMetadata } from '../src/lib/aspect-ratio-adaptation';

const mockVideoConfig = {
	fps: 30,
	width: 1920,
	height: 1080,
	durationInFrames: 1350,
	id: 'SymphonyStandalone',
};

vi.mock('remotion', async () => {
	const actual = await vi.importActual<typeof import('remotion')>('remotion');

	return {
		...actual,
		useCurrentFrame: () => 72,
		useVideoConfig: () => mockVideoConfig,
	};
});

describe('standalone aspect-ratio scene layout', () => {
	it('marks square Symphony renders as stacked layout shells', () => {
		mockVideoConfig.id = 'SymphonyStandaloneSquare';
		mockVideoConfig.width = 1080;
		mockVideoConfig.height = 1080;
		mockVideoConfig.durationInFrames = 1350;

		const scene = symphonyStandaloneSpec.scenes[1];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 1,
				sceneCount: symphonyStandaloneSpec.scenes.length,
				spec: symphonyStandaloneSpec,
				composition: createVideoCompositionMetadata(symphonyStandaloneSpec, '1:1'),
				captures: getCapturesForScene(symphonyStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('data-layout-mode="stacked"');
		expect(markup).toContain('data-aspect-ratio="1:1"');
		expect(markup).toContain('data-surface-priority="stage-heavy"');
	});

	it("marks vertical Director's Notes renders as portrait-safe layout shells", () => {
		mockVideoConfig.id = 'DirectorNotesStandaloneVertical';
		mockVideoConfig.width = 1080;
		mockVideoConfig.height = 1920;
		mockVideoConfig.durationInFrames = 1200;

		const scene = directorNotesStandaloneSpec.scenes[1];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 1,
				sceneCount: directorNotesStandaloneSpec.scenes.length,
				spec: directorNotesStandaloneSpec,
				composition: createVideoCompositionMetadata(directorNotesStandaloneSpec, '9:16'),
				captures: getCapturesForScene(directorNotesStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('data-layout-mode="portrait"');
		expect(markup).toContain('data-aspect-ratio="9:16"');
		expect(markup).toContain('data-story-note-columns="1"');
	});
});
