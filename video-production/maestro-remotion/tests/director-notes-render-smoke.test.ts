import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { directorNotesStandaloneSpec } from '../src/data/specs';
import { getSceneOffsets } from '../src/lib/timeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const renderOutputDir = mkdtempSync(join(tmpdir(), 'maestro-director-notes-render-smoke-'));

const renderStillFrame = (frame: number, label: string) => {
	const outputPath = join(renderOutputDir, `${label}.png`);
	const result = spawnSync(
		'pnpm',
		[
			'exec',
			'remotion',
			'still',
			'src/index.ts',
			directorNotesStandaloneSpec.id,
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

describe("Director's Notes render smoke", () => {
	it('renders Unified History and AI Overview stills through the real Remotion CLI', () => {
		const sceneOffsets = getSceneOffsets(directorNotesStandaloneSpec);
		const historyScene = sceneOffsets.find(
			({ scene }) => scene.id === 'director-notes-standalone-history'
		);
		const readyScene = sceneOffsets.find(
			({ scene }) => scene.id === 'director-notes-standalone-ai-ready'
		);

		expect(historyScene).toBeDefined();
		expect(readyScene).toBeDefined();

		renderStillFrame(
			historyScene!.startFrame + Math.floor(historyScene!.scene.durationInFrames / 2),
			'history'
		);
		renderStillFrame(
			readyScene!.startFrame + Math.floor(readyScene!.scene.durationInFrames / 2),
			'ai-ready'
		);
	}, 120_000);
});
