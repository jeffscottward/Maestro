import { describe, expect, it } from 'vitest';

import { symphonyStandaloneSpec } from '../src/data/specs';
import {
	getSymphonyCursorPose,
	getSymphonyFlowStage,
	getSymphonyStagePose,
} from '../src/animations/symphony-choreography';

describe('Symphony standalone choreography', () => {
	it('maps the standalone scene order to the approved discovery-to-proof story arc', () => {
		expect(symphonyStandaloneSpec.scenes.map((scene) => getSymphonyFlowStage(scene.id))).toEqual([
			'Discover',
			'Scope',
			'Activate',
			'Setup',
			'Active',
			'Proof',
		]);
	});

	it('keeps cursor guidance inside stage bounds for interactive handoff scenes', () => {
		const createAgentCursor = getSymphonyCursorPose('symphony-standalone-create-agent', 132, 240);
		const activeCursor = getSymphonyCursorPose('symphony-standalone-active-proof', 160, 270);

		for (const cursor of [createAgentCursor, activeCursor]) {
			expect(cursor.visible).toBe(true);
			expect(cursor.x).toBeGreaterThan(0);
			expect(cursor.x).toBeLessThan(1);
			expect(cursor.y).toBeGreaterThan(0);
			expect(cursor.y).toBeLessThan(1);
			expect(cursor.opacity).toBeGreaterThan(0.2);
		}
	});

	it('pushes closer for scope and activation, then settles the final proof scene', () => {
		const browsePose = getSymphonyStagePose('symphony-standalone-projects-browse', 72, 180);
		const detailPose = getSymphonyStagePose('symphony-standalone-issue-detail', 96, 210);
		const createAgentPose = getSymphonyStagePose('symphony-standalone-create-agent', 132, 240);
		const proofPose = getSymphonyStagePose('symphony-standalone-history-stats', 180, 240);

		expect(detailPose.scale).toBeGreaterThan(browsePose.scale);
		expect(createAgentPose.scale).toBeGreaterThan(detailPose.scale - 0.02);
		expect(proofPose.scale).toBeLessThanOrEqual(1.03);
		expect(Math.abs(proofPose.translateX)).toBeLessThan(40);
	});
});
