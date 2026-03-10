import { describe, expect, it } from 'vitest';

import { workspaceBootstrapSpec } from '../src/data/workspace-bootstrap-spec';
import { VideoCompositionPropsSchema } from '../src/data/production-schema';
import {
	WORKSPACE_COMPOSITION_ID,
	compositionDefinitions,
	getCompositionById,
} from '../src/lib/composition-registry';
import { getDurationInFrames } from '../src/lib/timeline';

describe('composition registry', () => {
	it('registers the teaser and all three prototype stubs alongside the workspace bootstrap', () => {
		expect(compositionDefinitions.map((definition) => definition.id)).toEqual([
			'MaestroWorkspaceBootstrap',
			'MaestroFeatureTeaser',
			'SymphonyPrototype',
			'DirectorNotesPrototype',
			'WorktreeSpinOffsPrototype',
		]);
	});

	it('derives composition timing from the structured video spec instead of hardcoded timelines', () => {
		const definition = getCompositionById(WORKSPACE_COMPOSITION_ID);

		expect(definition).toBeDefined();
		expect(definition?.durationInFrames).toBe(getDurationInFrames(workspaceBootstrapSpec));
		expect(definition?.defaultProps.spec.runtimeSeconds).toBe(6);
		expect(definition?.defaultProps.spec.scenes).toHaveLength(2);
	});

	it('exposes a zod schema so Remotion can edit composition props safely', () => {
		const definition = compositionDefinitions[0];

		expect(definition?.schema).toBe(VideoCompositionPropsSchema);
		expect(() => definition?.schema.parse(definition.defaultProps)).not.toThrow();
	});

	it('assigns explicit 30 fps timing to the teaser and each prototype stub because the current motion density is moderate', () => {
		const prototypeIds = [
			'MaestroFeatureTeaser',
			'SymphonyPrototype',
			'DirectorNotesPrototype',
			'WorktreeSpinOffsPrototype',
		] as const;

		for (const compositionId of prototypeIds) {
			const definition = getCompositionById(compositionId);

			expect(definition?.fps).toBe(30);
			expect(definition?.defaultProps.spec.fps).toBe(30);
			expect(definition?.defaultProps.spec.aspectRatio).toBe('16:9');
			expect(definition?.defaultProps.spec.scenes.length).toBeGreaterThan(0);
		}
	});
});
