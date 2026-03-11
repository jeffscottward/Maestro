import { createElement } from 'react';
import type React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MaestroFeatureComposition } from '../src/compositions/MaestroWorkspaceBootstrapComposition';
import { getCompositionById } from '../src/lib/composition-registry';

const sequenceProps: Array<{
	from: number;
	durationInFrames: number;
	premountFor: number;
}> = [];

vi.mock('remotion', () => ({
	AbsoluteFill: ({ children }: { children?: React.ReactNode }) =>
		createElement('div', { 'data-remotion-root': 'true' }, children),
	Sequence: ({
		children,
		from,
		durationInFrames,
		premountFor = 0,
	}: {
		children?: React.ReactNode;
		from: number;
		durationInFrames: number;
		premountFor?: number;
	}) => {
		sequenceProps.push({
			from,
			durationInFrames,
			premountFor,
		});

		return createElement(
			'section',
			{
				'data-sequence-from': String(from),
				'data-sequence-duration': String(durationInFrames),
				'data-sequence-premount': String(premountFor),
			},
			children
		);
	},
}));

vi.mock('../src/scenes/FeatureHeroScene', () => ({
	FeatureHeroScene: ({ scene, sceneIndex }: { scene: { id: string }; sceneIndex: number }) =>
		createElement(
			'article',
			{
				'data-scene-id': scene.id,
				'data-scene-index': String(sceneIndex),
			},
			scene.id
		),
}));

afterEach(() => {
	sequenceProps.length = 0;
});

describe("Director's Notes master composition", () => {
	it('keeps the six-scene 30 fps edit on fixed offsets and premounts each scene for entrance motion', () => {
		const composition = getCompositionById('DirectorNotesStandalone');

		expect(composition).toBeDefined();
		expect(composition?.fps).toBe(30);
		expect(composition?.durationInFrames).toBe(1200);

		const markup = renderToStaticMarkup(
			createElement(MaestroFeatureComposition, composition!.defaultProps)
		);

		expect(markup).toContain('director-notes-standalone-open');
		expect(markup).toContain('director-notes-standalone-close');
		expect(sequenceProps).toEqual([
			{ from: 0, durationInFrames: 150, premountFor: 24 },
			{ from: 150, durationInFrames: 240, premountFor: 24 },
			{ from: 390, durationInFrames: 210, premountFor: 24 },
			{ from: 600, durationInFrames: 150, premountFor: 24 },
			{ from: 750, durationInFrames: 240, premountFor: 24 },
			{ from: 990, durationInFrames: 210, premountFor: 24 },
		]);
	});
});
