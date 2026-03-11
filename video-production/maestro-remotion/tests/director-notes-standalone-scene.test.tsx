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

const renderStandaloneScene = (sceneIndex: number) => {
	const scene = directorNotesStandaloneSpec.scenes[sceneIndex];

	return renderToStaticMarkup(
		createElement(FeatureHeroScene, {
			scene,
			sceneIndex,
			sceneCount: directorNotesStandaloneSpec.scenes.length,
			spec: directorNotesStandaloneSpec,
			captures: getCapturesForScene(directorNotesStandaloneSpec, scene),
		})
	);
};

describe("Director's Notes standalone scene shell", () => {
	it("routes the standalone spec through the dedicated Director's Notes scene module", () => {
		const markup = renderStandaloneScene(0);

		expect(markup).toContain('User Action');
		expect(markup).toContain('System Response');
		expect(markup).toContain('Current Beat');
		expect(markup).toContain('Fragmentation');
		expect(markup).toContain('Check-In');
		expect(markup).toContain('Help / Unified History / AI Overview');
	});

	it('shows the next beat handoff for non-final scenes so the sequence reads like one video arc', () => {
		const openingMarkup = renderStandaloneScene(0);

		expect(openingMarkup).toContain('Next Beat');
		expect(openingMarkup).toContain('Filters');
		expect(openingMarkup).toContain('Unified History merges AUTO and USER work.');
	});

	it('does not render a next beat handoff on the closing scene', () => {
		const closingMarkup = renderStandaloneScene(directorNotesStandaloneSpec.scenes.length - 1);

		expect(closingMarkup).not.toContain('Next Beat');
	});
});
