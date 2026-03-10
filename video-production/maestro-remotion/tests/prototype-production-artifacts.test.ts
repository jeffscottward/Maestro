import { describe, expect, it } from 'vitest';

import { prototypeSpecs } from '../src/data/specs';
import {
	DATA_DRIVEN_TEXT_LAYERS,
	prototypeProductionArtifacts,
} from '../src/data/specs/prototype-production-artifacts';

describe('prototype production artifacts', () => {
	it('maps each prototype composition to its starter spec module path', () => {
		expect(
			prototypeProductionArtifacts.map((artifact) => [
				artifact.compositionId,
				artifact.specModulePath,
			])
		).toEqual([
			['MaestroFeatureTeaser', 'src/data/specs/feature-teaser-spec.ts'],
			['SymphonyPrototype', 'src/data/specs/symphony-prototype-spec.ts'],
			['DirectorNotesPrototype', 'src/data/specs/director-notes-prototype-spec.ts'],
			['WorktreeSpinOffsPrototype', 'src/data/specs/worktree-spin-offs-prototype-spec.ts'],
		]);
	});

	it('records reconstructed UI, data-driven text, and fallback capture coverage for every prototype scene', () => {
		expect(prototypeProductionArtifacts).toHaveLength(prototypeSpecs.length);

		for (const artifact of prototypeProductionArtifacts) {
			const spec = prototypeSpecs.find((candidate) => candidate.id === artifact.compositionId);

			expect(spec).toBeDefined();
			expect(artifact.aspectRatio).toBe(spec?.aspectRatio);
			expect(artifact.fps).toBe(spec?.fps);
			expect(artifact.runtimeSeconds).toBe(spec?.runtimeSeconds);
			expect(artifact.sceneDelivery.map((scene) => scene.sceneId)).toEqual(
				spec?.scenes.map((scene) => scene.id)
			);

			for (const sceneDelivery of artifact.sceneDelivery) {
				const specScene = spec?.scenes.find((scene) => scene.id === sceneDelivery.sceneId);
				const expectedCaptures =
					spec?.capturePlan.filter((capture) => specScene?.captureIds.includes(capture.id)) ?? [];

				expect(sceneDelivery.dataDrivenTextLayers).toEqual(DATA_DRIVEN_TEXT_LAYERS);
				expect(sceneDelivery.reconstructedUi.surfaceId).toBe(specScene?.surfaceId);
				expect(sceneDelivery.reconstructedUi.sourceCaptureIds).toEqual(
					expectedCaptures
						.filter((capture) => capture.mode === 'reconstructed-ui')
						.map((capture) => capture.id)
				);
				expect(sceneDelivery.captureFallbacks.map((capture) => capture.id)).toEqual(
					expectedCaptures
						.filter((capture) => capture.mode !== 'reconstructed-ui')
						.map((capture) => capture.id)
				);
			}
		}
	});
});
