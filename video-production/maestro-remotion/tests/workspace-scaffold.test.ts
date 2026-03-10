import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	WORKSPACE_COMPOSITION_ID,
	WORKSPACE_DIMENSIONS,
	WORKSPACE_DURATION_IN_FRAMES,
	WORKSPACE_FPS,
	workspaceBootstrapDefaults,
} from '../src/workspace-metadata';

describe('maestro remotion workspace scaffold', () => {
	it('defines a 16:9 bootstrap composition for the isolated workspace', () => {
		expect(WORKSPACE_COMPOSITION_ID).toBe('MaestroWorkspaceBootstrap');
		expect(WORKSPACE_DIMENSIONS).toEqual({
			width: 1920,
			height: 1080,
		});
		expect(WORKSPACE_FPS).toBe(30);
		expect(WORKSPACE_DURATION_IN_FRAMES).toBe(180);
		expect(workspaceBootstrapDefaults.title).toContain('Maestro');
	});

	it('records the requested source-of-truth references and product terminology', () => {
		const docPath = resolve(process.cwd(), 'docs/research/project-sources.md');
		expect(existsSync(docPath)).toBe(true);

		const content = readFileSync(docPath, 'utf8');
		expect(content).toContain('src/shared/themes.ts');
		expect(content).toContain('src/renderer/components/WorktreeRunSection.tsx');
		expect(content).toContain('Maestro Symphony');
		expect(content).toContain("Director's Notes");
		expect(content).toContain('Dispatch to a separate worktree');
		expect(content).toContain('[[master-production-plan]]');
	});
});
