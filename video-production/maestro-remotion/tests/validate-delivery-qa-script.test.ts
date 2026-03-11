import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

describe('delivery QA validation script', () => {
	it('passes for the scaffolded standalone delivery workspace', () => {
		const result = spawnSync('pnpm', ['validate:qa'], {
			cwd: workspaceRoot,
			encoding: 'utf8',
		});

		expect(result.status, result.stderr).toBe(0);
		expect(result.stdout).toContain('Final delivery QA passed');
	});
});
