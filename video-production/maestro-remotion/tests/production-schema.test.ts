import { describe, expect, it } from 'vitest';

import {
	VideoCompositionPropsSchema,
	VideoSpecSchema,
	type VideoSpec,
	validateVideoSpec,
} from '../src/data/production-schema';
import { workspaceBootstrapSpec } from '../src/data/workspace-bootstrap-spec';

describe('production schema', () => {
	it('parses the workspace bootstrap spec and composition props', () => {
		expect(() => validateVideoSpec(workspaceBootstrapSpec)).not.toThrow();
		expect(VideoCompositionPropsSchema.parse({ spec: workspaceBootstrapSpec }).spec.id).toBe(
			'MaestroWorkspaceBootstrap'
		);
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
