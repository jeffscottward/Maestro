import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { compositionDefinitions, WORKSPACE_COMPOSITION_ID } from '../src/lib/composition-registry';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

describe('maestro remotion workspace scaffold', () => {
	it('creates the required folder layout for production work', () => {
		const requiredDirectories = [
			'src/compositions',
			'src/scenes',
			'src/components',
			'src/ui',
			'src/animations',
			'src/data',
			'src/data/specs',
			'src/assets',
			'src/lib',
			'renders',
		];

		for (const relativePath of requiredDirectories) {
			expect(existsSync(resolve(workspaceRoot, relativePath)), `${relativePath} should exist`).toBe(
				true
			);
		}
	});

	it('registers the workspace bootstrap composition alongside the standalone feature masters and their adaptation variants', () => {
		expect(compositionDefinitions).toHaveLength(14);
		expect(compositionDefinitions[0]?.id).toBe(WORKSPACE_COMPOSITION_ID);
		expect(compositionDefinitions[0]?.width).toBe(1920);
		expect(compositionDefinitions[0]?.height).toBe(1080);
		expect(compositionDefinitions[0]?.fps).toBe(30);
		expect(compositionDefinitions[0]?.durationInFrames).toBe(180);
		expect(compositionDefinitions.map((composition) => composition.id)).toEqual([
			'MaestroWorkspaceBootstrap',
			'MaestroFeatureTeaser',
			'SymphonyPrototype',
			'DirectorNotesPrototype',
			'WorktreeSpinOffsPrototype',
			'SymphonyStandalone',
			'SymphonyStandaloneSquare',
			'SymphonyStandaloneVertical',
			'DirectorNotesStandalone',
			'DirectorNotesStandaloneSquare',
			'DirectorNotesStandaloneVertical',
			'WorktreeSpinOffsStandalone',
			'WorktreeSpinOffsStandaloneSquare',
			'WorktreeSpinOffsStandaloneVertical',
		]);
	});

	it('keeps the source research artifact linked into the workspace', () => {
		const docPath = resolve(workspaceRoot, 'docs/research/project-sources.md');
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
