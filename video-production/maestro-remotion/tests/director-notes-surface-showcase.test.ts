import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
	DirectorNotesSurfaceShowcase,
	getDirectorNotesSceneVariant,
} from '../src/components/DirectorNotesSurfaceShowcase';
import { directorNotesPrototypeSpec, directorNotesStandaloneSpec } from '../src/data/specs';
import { MAESTRO_SURFACE_THEMES } from '../src/lib/maestroVisualSystem';
import { getCapturesForScene } from '../src/lib/timeline';

const directorTheme = MAESTRO_SURFACE_THEMES['director-notes'];

const renderScene = (
	spec: typeof directorNotesPrototypeSpec | typeof directorNotesStandaloneSpec,
	sceneId: string
) => {
	const scene = spec.scenes.find((candidate) => candidate.id === sceneId);

	if (!scene) {
		throw new Error(`Missing scene: ${sceneId}`);
	}

	return renderToStaticMarkup(
		createElement(DirectorNotesSurfaceShowcase, {
			scene,
			captures: getCapturesForScene(spec, scene),
			progress: 0.74,
			theme: directorTheme,
		})
	);
};

describe("Director's Notes surface showcase", () => {
	it('maps the prototype and standalone scene ids to the expected UI variants', () => {
		expect(
			directorNotesPrototypeSpec.scenes.map((scene) => [
				scene.id,
				getDirectorNotesSceneVariant(scene),
			])
		).toEqual([
			['director-history-overview', 'history-default'],
			['director-ai-overview-flow', 'ai-ready'],
		]);

		expect(
			directorNotesStandaloneSpec.scenes.map((scene) => [
				scene.id,
				getDirectorNotesSceneVariant(scene),
			])
		).toEqual([
			['director-notes-standalone-open', 'history-default'],
			['director-notes-standalone-history', 'history-filtered'],
			['director-notes-standalone-detail', 'history-detail'],
			['director-notes-standalone-ai-loading', 'history-warmup'],
			['director-notes-standalone-ai-ready', 'ai-ready'],
			['director-notes-standalone-close', 'evidence-bridge'],
		]);
	});

	it('renders the filtered history and detail variants with session jump-back cues', () => {
		const filteredMarkup = renderScene(
			directorNotesStandaloneSpec,
			'director-notes-standalone-history'
		);
		const detailMarkup = renderScene(
			directorNotesStandaloneSpec,
			'director-notes-standalone-detail'
		);

		expect(filteredMarkup).toContain('Unified History');
		expect(filteredMarkup).toContain('AUTO');
		expect(filteredMarkup).toContain('USER');
		expect(filteredMarkup).toContain('rss');
		expect(filteredMarkup).toContain('Open session');

		expect(detailMarkup).toContain('Evidence Detail');
		expect(detailMarkup).toContain('Prev');
		expect(detailMarkup).toContain('Next');
		expect(detailMarkup).toContain('Resume Session');
	});

	it('renders the warmup, ready, and closing bridge states with the shipped AI Overview labels', () => {
		const loadingMarkup = renderScene(
			directorNotesStandaloneSpec,
			'director-notes-standalone-ai-loading'
		);
		const readyMarkup = renderScene(
			directorNotesStandaloneSpec,
			'director-notes-standalone-ai-ready'
		);
		const closingMarkup = renderScene(
			directorNotesStandaloneSpec,
			'director-notes-standalone-close'
		);

		expect(loadingMarkup).toContain('generating...');
		expect(loadingMarkup).toContain('Generating synopsis...');
		expect(loadingMarkup).toContain('Preparing from current history files');

		expect(readyMarkup).toContain('AI Overview');
		expect(readyMarkup).toContain('Regenerate');
		expect(readyMarkup).toContain('Save');
		expect(readyMarkup).toContain('Copy');
		expect(readyMarkup).toContain('Accomplishments');

		expect(closingMarkup).toContain('history files');
		expect(closingMarkup).toContain('synopsis out');
		expect(closingMarkup).toContain('+ grounded synthesis');
	});
});
