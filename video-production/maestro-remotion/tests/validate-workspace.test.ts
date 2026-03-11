import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { prototypeSpecs } from '../src/data/specs';
import { validateVideoSpecCompleteness } from '../src/lib/production-validation';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

describe('workspace validation script', () => {
	it('declares the Remotion CLI alongside the runtime package', () => {
		const packageJson = JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf8'));

		expect(
			packageJson.dependencies?.['@remotion/cli'] ?? packageJson.devDependencies?.['@remotion/cli']
		).toBeDefined();
		expect(packageJson.dependencies?.tsx ?? packageJson.devDependencies?.tsx).toBeDefined();
		expect(packageJson.packageManager).toMatch(/^pnpm@/);
		expect(packageJson.scripts?.['validate:qa']).toBeDefined();
		expect(packageJson.scripts?.['render:matrix:plan']).toBeDefined();
		expect(packageJson.scripts?.['render:matrix']).toBeDefined();
	});

	it('passes for the scaffolded standalone Remotion workspace', () => {
		const result = spawnSync('pnpm', ['validate:workspace'], {
			cwd: workspaceRoot,
			encoding: 'utf8',
		});

		expect(result.status, result.stderr).toBe(0);
		expect(result.stdout).toContain('Workspace validation passed');
	});

	it('fails completeness validation when required spec fields are blanked out', () => {
		const issues = validateVideoSpecCompleteness({
			...prototypeSpecs[0],
			featureName: '',
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
});
