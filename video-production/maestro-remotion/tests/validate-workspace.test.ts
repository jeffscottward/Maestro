import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

describe('workspace validation script', () => {
	it('declares the Remotion CLI alongside the runtime package', () => {
		const packageJson = JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf8'));

		expect(
			packageJson.dependencies?.['@remotion/cli'] ?? packageJson.devDependencies?.['@remotion/cli']
		).toBeDefined();
		expect(packageJson.packageManager).toMatch(/^pnpm@/);
	});

	it('passes for the scaffolded standalone Remotion workspace', () => {
		const result = spawnSync('node', ['scripts/validate-workspace.mjs'], {
			cwd: workspaceRoot,
			encoding: 'utf8',
		});

		expect(result.status, result.stderr).toBe(0);
		expect(result.stdout).toContain('Workspace validation passed');
	});
});
