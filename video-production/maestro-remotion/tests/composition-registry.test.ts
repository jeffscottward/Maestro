import { describe, expect, it } from 'vitest';

import { workspaceBootstrapSpec } from '../src/data/workspace-bootstrap-spec';
import { VideoCompositionPropsSchema } from '../src/data/production-schema';
import {
	directorNotesStandaloneSpec,
	symphonyStandaloneSpec,
	worktreeSpinOffsStandaloneSpec,
} from '../src/data/specs';
import {
	WORKSPACE_COMPOSITION_ID,
	compositionDefinitions,
	getCompositionById,
} from '../src/lib/composition-registry';
import { getDurationInFrames } from '../src/lib/timeline';

describe('composition registry', () => {
	it('registers the workspace bootstrap, prototype reel, and aspect-ratio variants for each standalone feature master', () => {
		expect(compositionDefinitions.map((definition) => definition.id)).toEqual([
			'MaestroWorkspaceBootstrap',
			'MaestroFeatureTeaser',
			'SymphonyPrototype',
			'DirectorNotesPrototype',
			'WorktreeSpinOffsPrototype',
			'SymphonyStandalone',
			'SymphonyStandaloneSquare',
			'SymphonyStandaloneVertical',
			'DirectorNotesStandalone',
			'DirectorNotesStandaloneSquare',
			'DirectorNotesStandaloneVertical',
			'WorktreeSpinOffsStandalone',
			'WorktreeSpinOffsStandaloneSquare',
			'WorktreeSpinOffsStandaloneVertical',
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

	it('registers the Symphony standalone master so it can render as a first-class composition', () => {
		const definition = getCompositionById('SymphonyStandalone');

		expect(definition).toBeDefined();
		expect(definition?.fps).toBe(30);
		expect(definition?.durationInFrames).toBe(getDurationInFrames(symphonyStandaloneSpec));
		expect(definition?.defaultProps.spec.id).toBe('SymphonyStandalone');
		expect(definition?.defaultProps.spec.featureName).toBe('Maestro Symphony');
		expect(definition?.defaultProps.composition.aspectRatio).toBe('16:9');
		expect(definition?.defaultProps.composition.dimensions).toEqual({ width: 1920, height: 1080 });
	});

	it("registers the Director's Notes standalone master at 30 fps for the list-traversal and summary handoff motion", () => {
		const definition = getCompositionById('DirectorNotesStandalone');

		expect(definition).toBeDefined();
		expect(definition?.fps).toBe(30);
		expect(definition?.durationInFrames).toBe(getDurationInFrames(directorNotesStandaloneSpec));
		expect(definition?.defaultProps.spec.id).toBe('DirectorNotesStandalone');
		expect(definition?.defaultProps.spec.featureName).toBe("Director's Notes");
		expect(definition?.defaultProps.composition.aspectRatio).toBe('16:9');
	});

	it('registers the Worktree Spin-offs standalone master so the dedicated worktree scenes can render as a first-class composition', () => {
		const definition = getCompositionById('WorktreeSpinOffsStandalone');

		expect(definition).toBeDefined();
		expect(definition?.fps).toBe(30);
		expect(definition?.durationInFrames).toBe(getDurationInFrames(worktreeSpinOffsStandaloneSpec));
		expect(definition?.defaultProps.spec.id).toBe('WorktreeSpinOffsStandalone');
		expect(definition?.defaultProps.spec.featureName).toBe('Run in Worktree');
		expect(definition?.defaultProps.composition.aspectRatio).toBe('16:9');
	});

	it('registers square and vertical cutdowns without forking the underlying standalone specs', () => {
		const square = getCompositionById('SymphonyStandaloneSquare');
		const vertical = getCompositionById('DirectorNotesStandaloneVertical');
		const worktreeVertical = getCompositionById('WorktreeSpinOffsStandaloneVertical');

		expect(square?.durationInFrames).toBe(getDurationInFrames(symphonyStandaloneSpec));
		expect(square?.width).toBe(1080);
		expect(square?.height).toBe(1080);
		expect(square?.defaultProps.spec.id).toBe('SymphonyStandalone');
		expect(square?.defaultProps.composition.aspectRatio).toBe('1:1');
		expect(square?.defaultProps.composition.safeZone).toContain('Start Symphony');

		expect(vertical?.durationInFrames).toBe(getDurationInFrames(directorNotesStandaloneSpec));
		expect(vertical?.width).toBe(1080);
		expect(vertical?.height).toBe(1920);
		expect(vertical?.defaultProps.spec.id).toBe('DirectorNotesStandalone');
		expect(vertical?.defaultProps.composition.aspectRatio).toBe('9:16');
		expect(vertical?.defaultProps.composition.framing).toContain('Stack the history controls');

		expect(worktreeVertical?.defaultProps.spec.id).toBe('WorktreeSpinOffsStandalone');
		expect(worktreeVertical?.defaultProps.composition.aspectRatio).toBe('9:16');
		expect(worktreeVertical?.defaultProps.composition.safeZone).toContain('terminal proof');
	});
});
