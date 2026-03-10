import { describe, expect, it } from 'vitest';

import { DIRECTOR_NOTES_TAB_ORDER } from '../src/components/DirectorNotesPrimitives';
import { validateVideoSpec } from '../src/data/production-schema';
import { directorNotesStandaloneSpec } from '../src/data/specs';
import { validateVideoSpecCompleteness } from '../src/lib/production-validation';
import { getCapturesForScene } from '../src/lib/timeline';

const REQUIRED_DIRECTOR_NOTES_SCENE_IDS = [
	'director-notes-standalone-open',
	'director-notes-standalone-history',
	'director-notes-standalone-detail',
	'director-notes-standalone-ai-loading',
	'director-notes-standalone-ai-ready',
	'director-notes-standalone-close',
] as const;

const EXPECTED_SCENE_CAPTURE_IDS = [
	['director-notes-standalone-open', ['director-modal-open']],
	['director-notes-standalone-history', ['director-unified-history']],
	['director-notes-standalone-detail', ['director-unified-history', 'director-history-detail']],
	['director-notes-standalone-ai-loading', ['director-ai-overview-loading']],
	['director-notes-standalone-ai-ready', ['director-ai-overview-ready']],
	[
		'director-notes-standalone-close',
		['director-unified-history', 'director-ai-overview-ready', 'director-evidence-link'],
	],
] as const;

describe("Director's Notes standalone validation", () => {
	it("keeps the approved Director's Notes scene IDs and storyboard order locked", () => {
		expect(directorNotesStandaloneSpec.scenes.map((scene) => scene.id)).toEqual(
			REQUIRED_DIRECTOR_NOTES_SCENE_IDS
		);
		expect(
			directorNotesStandaloneSpec.scenes.map((scene) => scene.storyboard?.sceneNumber ?? null)
		).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('keeps the tab strip ordering and narrative states aligned with the shipped feature', () => {
		expect(DIRECTOR_NOTES_TAB_ORDER).toEqual([
			{ id: 'overview', label: 'Help' },
			{ id: 'history', label: 'Unified History' },
			{ id: 'ai-overview', label: 'AI Overview' },
		]);
		expect(directorNotesStandaloneSpec.terminology).toEqual(
			expect.arrayContaining(['Help', 'Unified History', 'AI Overview', 'AUTO', 'USER'])
		);
		expect(
			directorNotesStandaloneSpec.scenes.map((scene) => [
				scene.id,
				scene.storyboard?.uiStateShown ?? '',
			])
		).toEqual([
			[
				'director-notes-standalone-open',
				"`Director's Notes` opening into the default `Unified History` state with `Help`, `Unified History`, and `AI Overview` visible in the tab strip.",
			],
			[
				'director-notes-standalone-history',
				'`Unified History` with filters, search, stats, and dense activity rows.',
			],
			[
				'director-notes-standalone-detail',
				'History detail modal with resume and entry navigation affordances.',
			],
			[
				'director-notes-standalone-ai-loading',
				'`Unified History` remains active while `AI Overview` shows generating state in the tab strip.',
			],
			[
				'director-notes-standalone-ai-ready',
				'Ready `AI Overview` state with synopsis sections and export controls.',
			],
			[
				'director-notes-standalone-close',
				'`Unified History` and `AI Overview` shown as a linked workflow.',
			],
		]);
	});

	it('keeps the standalone spec schema-valid and production-complete', () => {
		expect(() => validateVideoSpec(directorNotesStandaloneSpec)).not.toThrow();
		expect(validateVideoSpecCompleteness(directorNotesStandaloneSpec)).toEqual([]);
	});

	it("maps the expected capture states onto each rendered Director's Notes scene", () => {
		expect(
			directorNotesStandaloneSpec.scenes.map((scene) => [
				scene.id,
				getCapturesForScene(directorNotesStandaloneSpec, scene).map((capture) => capture.id),
			])
		).toEqual(EXPECTED_SCENE_CAPTURE_IDS);
	});
});
