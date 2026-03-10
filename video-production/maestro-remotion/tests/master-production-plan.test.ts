import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const masterPlanPath = resolve(workspaceRoot, 'docs/strategy/master-production-plan.md');

describe('master production plan artifact', () => {
	it('stores the strategy note with YAML front matter and planning links', () => {
		expect(existsSync(masterPlanPath)).toBe(true);

		const doc = readFileSync(masterPlanPath, 'utf8');

		expect(doc.startsWith('---\n')).toBe(true);
		expect(doc).toContain('type: analysis');
		expect(doc).toContain('title: Maestro Master Production Plan');
		expect(doc).toContain('[[project-sources]]');
		expect(doc).toContain('[[symphony-prototype-plan]]');
		expect(doc).toContain('[[director-notes-prototype-plan]]');
		expect(doc).toContain('[[worktree-spin-offs-prototype-plan]]');
	});

	it('documents the master 16:9 plan, ratio adaptation approach, and starter spec modules', () => {
		const doc = readFileSync(masterPlanPath, 'utf8');

		expect(doc).toContain('16:9');
		expect(doc).toContain('1920x1080');
		expect(doc).toContain('9:16');
		expect(doc).toContain('1:1');
		expect(doc).toContain('Open Implementation Constraints');
		expect(doc).toContain('src/data/specs/feature-teaser-spec.ts');
		expect(doc).toContain('src/data/specs/symphony-prototype-spec.ts');
		expect(doc).toContain('src/data/specs/director-notes-prototype-spec.ts');
		expect(doc).toContain('src/data/specs/worktree-spin-offs-prototype-spec.ts');
		expect(doc).toContain('Prototype Scene Delivery Matrix');
		expect(doc).toContain('reconstructed UI');
		expect(doc).toContain('data-driven text');
		expect(doc).toContain('capture fallback');
	});
});
