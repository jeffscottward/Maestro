import { describe, expect, it } from 'vitest';

import { validateVideoSpec } from '../src/data/production-schema';
import { symphonyStandaloneSpec } from '../src/data/specs';
import { validateVideoSpecCompleteness } from '../src/lib/production-validation';
import { getCapturesForScene } from '../src/lib/timeline';

const REQUIRED_SYMPHONY_SCENE_IDS = [
	'symphony-standalone-projects-browse',
	'symphony-standalone-issue-detail',
	'symphony-standalone-create-agent',
	'symphony-standalone-setup-proof',
	'symphony-standalone-active-proof',
	'symphony-standalone-history-stats',
] as const;

const EXPECTED_SCENE_CAPTURE_IDS = [
	['symphony-standalone-projects-browse', ['symphony-projects-browse']],
	[
		'symphony-standalone-issue-detail',
		['symphony-projects-browse', 'symphony-issue-detail-preview'],
	],
	[
		'symphony-standalone-create-agent',
		['symphony-issue-detail-preview', 'symphony-create-agent-modal'],
	],
	['symphony-standalone-setup-proof', ['symphony-create-agent-modal', 'symphony-setup-proof']],
	['symphony-standalone-active-proof', ['symphony-active-proof']],
	['symphony-standalone-history-stats', ['symphony-history-stats-proof']],
] as const;

describe('Symphony standalone validation', () => {
	it('keeps the approved Symphony scene IDs and storyboard order locked', () => {
		expect(symphonyStandaloneSpec.scenes.map((scene) => scene.id)).toEqual(
			REQUIRED_SYMPHONY_SCENE_IDS
		);
		expect(
			symphonyStandaloneSpec.scenes.map((scene) => scene.storyboard?.sceneNumber ?? null)
		).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('keeps the standalone spec schema-valid and production-complete', () => {
		expect(() => validateVideoSpec(symphonyStandaloneSpec)).not.toThrow();
		expect(validateVideoSpecCompleteness(symphonyStandaloneSpec)).toEqual([]);
	});

	it('maps the expected capture states onto each rendered Symphony scene', () => {
		expect(
			symphonyStandaloneSpec.scenes.map((scene) => [
				scene.id,
				getCapturesForScene(symphonyStandaloneSpec, scene).map((capture) => capture.id),
			])
		).toEqual(EXPECTED_SCENE_CAPTURE_IDS);
	});
});
