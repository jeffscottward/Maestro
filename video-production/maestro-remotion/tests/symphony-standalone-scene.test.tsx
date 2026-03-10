import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { symphonyStandaloneSpec } from '../src/data/specs';
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
			durationInFrames: 1350,
			id: 'SymphonyStandalone',
		}),
	};
});

describe('Symphony standalone scene shell', () => {
	it('renders the standalone narrative rail, stage beat, and full flow strip for the opener', () => {
		const scene = symphonyStandaloneSpec.scenes[0];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 0,
				sceneCount: symphonyStandaloneSpec.scenes.length,
				spec: symphonyStandaloneSpec,
				captures: getCapturesForScene(symphonyStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('User Action');
		expect(markup).toContain('System Response');
		expect(markup).toContain('Current Beat');
		expect(markup).toContain('Discover');
		expect(markup).toContain('Proof');
		expect(markup).toContain('Projects');
	});
});
