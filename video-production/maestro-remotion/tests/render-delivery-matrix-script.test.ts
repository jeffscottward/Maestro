import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const tempDir = mkdtempSync(join(tmpdir(), 'maestro-render-matrix-script-'));

afterAll(() => {
	rmSync(tempDir, {
		recursive: true,
		force: true,
	});
});

describe('render delivery matrix script', () => {
	it('writes a filtered render manifest without rendering files', () => {
		const manifestPath = join(tempDir, 'delivery-render-matrix.json');
		const result = spawnSync(
			'pnpm',
			[
				'exec',
				'tsx',
				'scripts/render-delivery-matrix.mjs',
				'plan',
				'--feature',
				'symphony',
				'--aspect-ratio',
				'1:1',
				'--version',
				'v3',
				'--output-root',
				'renders/test-plan',
				'--manifest-path',
				manifestPath,
			],
			{
				cwd: workspaceRoot,
				encoding: 'utf8',
			}
		);

		expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
		expect(result.stdout).toContain('Planned 1 render target(s).');
		expect(existsSync(manifestPath)).toBe(true);

		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

		expect(manifest.targetCount).toBe(1);
		expect(manifest.targets[0]).toMatchObject({
			specId: 'SymphonyStandalone',
			compositionId: 'SymphonyStandaloneSquare',
			outputPath: 'renders/test-plan/symphony/1x1/v3/symphony-standalone-1x1-30fps-v3.mp4',
		});
	});
});
