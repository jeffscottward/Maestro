import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { directorNotesStandaloneSpec } from '../src/data/specs';
import { getCapturesForScene } from '../src/lib/timeline';
import { FeatureHeroScene } from '../src/scenes/FeatureHeroScene';

vi.mock('remotion', async () => {
	const actual = await vi.importActual<typeof import('remotion')>('remotion');

	return {
		...actual,
		useCurrentFrame: () => 72,
		useVideoConfig: () => ({
			fps: 30,
			width: 1920,
			height: 1080,
			durationInFrames: 1200,
			id: 'DirectorNotesStandalone',
		}),
	};
});

describe("Director's Notes standalone scene shell", () => {
	it("routes the standalone spec through the dedicated Director's Notes scene module", () => {
		const scene = directorNotesStandaloneSpec.scenes[0];
		const markup = renderToStaticMarkup(
			createElement(FeatureHeroScene, {
				scene,
				sceneIndex: 0,
				sceneCount: directorNotesStandaloneSpec.scenes.length,
				spec: directorNotesStandaloneSpec,
				captures: getCapturesForScene(directorNotesStandaloneSpec, scene),
			})
		);

		expect(markup).toContain('User Action');
		expect(markup).toContain('System Response');
		expect(markup).toContain('Current Beat');
		expect(markup).toContain('Fragmentation');
		expect(markup).toContain('Check-In');
		expect(markup).toContain('Help / Unified History / AI Overview');
	});
});
