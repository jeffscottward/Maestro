import { describe, expect, it } from 'vitest';

import { prototypeSpecs } from '../src/data/specs';
import { getCompositionById } from '../src/lib/composition-registry';
import {
	REQUIRED_PROTOTYPE_COMPOSITION_IDS,
	validatePrototypeWorkspace,
	validateVideoSpecCompleteness,
} from '../src/lib/production-validation';
import { getDurationInFrames } from '../src/lib/timeline';

describe('prototype smoke validation', () => {
	it('keeps the teaser and three feature stubs present with minimum structured completeness', () => {
		expect(prototypeSpecs.map((spec) => spec.id)).toEqual(REQUIRED_PROTOTYPE_COMPOSITION_IDS);

		for (const spec of prototypeSpecs) {
			expect(validateVideoSpecCompleteness(spec)).toEqual([]);
			expect(spec.scenes.length).toBeGreaterThan(0);
			expect(spec.capturePlan.length).toBeGreaterThan(0);
			expect(spec.capturePlan.some((capture) => capture.required)).toBe(true);
		}
	});

	it('keeps each registered prototype composition aligned with its source spec', () => {
		for (const spec of prototypeSpecs) {
			const definition = getCompositionById(spec.id);

			expect(definition).toBeDefined();
			expect(definition?.fps).toBe(spec.fps);
			expect(definition?.durationInFrames).toBe(getDurationInFrames(spec));
			expect(definition?.width).toBe(spec.dimensions.width);
			expect(definition?.height).toBe(spec.dimensions.height);
			expect(definition?.defaultProps.spec.id).toBe(spec.id);
			expect(definition?.defaultProps.spec.featureName).toBe(spec.featureName);
			expect(definition?.defaultProps.spec.capturePlan.length).toBe(spec.capturePlan.length);
			expect(definition?.defaultProps.spec.scenes.length).toBe(spec.scenes.length);
		}
	});

	it('flags missing required production fields before a composition can render', () => {
		const issues = validateVideoSpecCompleteness({
			...prototypeSpecs[0],
			featureName: ' ',
			fps: 0,
			runtimeSeconds: 0,
			scenes: [],
			capturePlan: [],
		});

		expect(issues).toEqual(
			expect.arrayContaining([
				expect.stringContaining('featureName'),
				expect.stringContaining('fps'),
				expect.stringContaining('runtimeSeconds'),
				expect.stringContaining('scenes'),
				expect.stringContaining('capturePlan'),
			])
		);
	});

	it('passes the aggregate prototype workspace smoke validation for the current data set', () => {
		expect(validatePrototypeWorkspace()).toEqual([]);
	});
});
