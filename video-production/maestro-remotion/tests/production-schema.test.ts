import { describe, expect, it } from 'vitest';

import {
	VideoCompositionPropsSchema,
	VideoSpecSchema,
	type VideoSpec,
	validateVideoSpec,
} from '../src/data/production-schema';
import { prototypeSpecs } from '../src/data/specs';
import { workspaceBootstrapSpec } from '../src/data/workspace-bootstrap-spec';
import { createVideoCompositionMetadata } from '../src/lib/aspect-ratio-adaptation';

describe('production schema', () => {
	it('parses the workspace bootstrap spec, prototype specs, and composition props', () => {
		expect(() => validateVideoSpec(workspaceBootstrapSpec)).not.toThrow();
		for (const spec of prototypeSpecs) {
			expect(() => validateVideoSpec(spec)).not.toThrow();
			expect(spec.scenes.every((scene) => scene.surfaceId.length > 0)).toBe(true);
		}
		expect(
			VideoCompositionPropsSchema.parse({
				spec: workspaceBootstrapSpec,
				composition: createVideoCompositionMetadata(workspaceBootstrapSpec, '16:9'),
			}).spec.id
		).toBe('MaestroWorkspaceBootstrap');
	});

	it('rejects specs missing required timeline and capture metadata', () => {
		const invalidSpec: VideoSpec = {
			...workspaceBootstrapSpec,
			scenes: [],
			capturePlan: [],
		};

		const result = VideoSpecSchema.safeParse(invalidSpec);

		expect(result.success).toBe(false);
		expect(result.error?.issues.some((issue) => issue.path[0] === 'scenes')).toBe(true);
		expect(result.error?.issues.some((issue) => issue.path[0] === 'capturePlan')).toBe(true);
	});
});
