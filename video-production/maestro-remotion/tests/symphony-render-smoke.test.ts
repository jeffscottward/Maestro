import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { symphonyStandaloneSpec } from '../src/data/specs';
import { getSceneOffsets } from '../src/lib/timeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const renderOutputDir = mkdtempSync(join(tmpdir(), 'maestro-symphony-render-smoke-'));

const renderStillFrame = (frame: number, label: string) => {
	const outputPath = join(renderOutputDir, `${label}.png`);
	const result = spawnSync(
		'pnpm',
		[
			'exec',
			'remotion',
			'still',
			'src/index.ts',
			symphonyStandaloneSpec.id,
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

describe('Symphony render smoke', () => {
	it('renders opening and closing Symphony frames through the real Remotion CLI', () => {
		const sceneOffsets = getSceneOffsets(symphonyStandaloneSpec);
		const openingScene = sceneOffsets[0];
		const closingScene = sceneOffsets.at(-1);

		expect(openingScene).toBeDefined();
		expect(closingScene).toBeDefined();

		renderStillFrame(
			openingScene!.startFrame + Math.floor(openingScene!.scene.durationInFrames / 2),
			'opening'
		);
		renderStillFrame(
			closingScene!.startFrame + Math.floor(closingScene!.scene.durationInFrames / 2),
			'closing'
		);
	}, 120_000);
});
