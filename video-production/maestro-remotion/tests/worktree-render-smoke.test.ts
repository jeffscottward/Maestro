import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import { getSceneOffsets } from '../src/lib/timeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const renderOutputDir = mkdtempSync(join(tmpdir(), 'maestro-worktree-render-smoke-'));

const renderStillFrame = (frame: number, label: string) => {
	const outputPath = join(renderOutputDir, `${label}.png`);
	const result = spawnSync(
		'pnpm',
		[
			'exec',
			'remotion',
			'still',
			'src/index.ts',
			worktreeSpinOffsStandaloneSpec.id,
			outputPath,
			`--frame=${frame}`,
		],
		{
			cwd: workspaceRoot,
			encoding: 'utf8',
		}
	);

	expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
	expect(existsSync(outputPath)).toBe(true);
};

afterAll(() => {
	rmSync(renderOutputDir, {
		recursive: true,
		force: true,
	});
});

describe('Worktree render smoke', () => {
	it('renders dispatch and inventory stills through the real Remotion CLI', () => {
		const sceneOffsets = getSceneOffsets(worktreeSpinOffsStandaloneSpec);
		const dispatchScene = sceneOffsets.find(({ scene }) => scene.id === 'worktree-standalone-risk');
		const inventoryScene = sceneOffsets.find(
			({ scene }) => scene.id === 'worktree-standalone-inventory'
		);

		expect(dispatchScene).toBeDefined();
		expect(inventoryScene).toBeDefined();

		renderStillFrame(
			dispatchScene!.startFrame + Math.floor(dispatchScene!.scene.durationInFrames / 2),
			'dispatch'
		);
		renderStillFrame(
			inventoryScene!.startFrame + Math.floor(inventoryScene!.scene.durationInFrames / 2),
			'inventory'
		);
	}, 120_000);
});
