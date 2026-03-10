import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

import { validateVideoSpec } from '../src/data/production-schema';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const storyboardDir = resolve(workspaceRoot, 'docs/storyboards');
const specsDir = resolve(workspaceRoot, 'src/data/specs');

const requiredStoryboardColumns = [
	'scene_number',
	'purpose',
	'on_screen_copy',
	'visual_composition',
	'ui_state_shown',
	'user_action',
	'system_response',
	'motion_style',
	'duration_seconds',
];

const storyboardDocs = [
	{
		fileName: 'symphony-storyboard.md',
		title: 'Maestro Symphony Storyboard',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[symphony-prototype-plan]]',
			'[[symphony-feature-research]]',
			'`Start Symphony`',
			'`Create Agent`',
		],
	},
	{
		fileName: 'director-notes-storyboard.md',
		title: "Director's Notes Storyboard",
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[director-notes-prototype-plan]]',
			'[[director-notes-feature-research]]',
			'`Unified History`',
			'`AI Overview`',
		],
	},
	{
		fileName: 'worktree-spin-offs-storyboard.md',
		title: 'Worktree Spin-offs Storyboard',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[worktree-spin-offs-prototype-plan]]',
			'[[worktree-spin-offs-feature-research]]',
			'`Run in Worktree`',
			'`Dispatch to a separate worktree`',
		],
	},
] as const;

const standaloneSpecModules = [
	{
		fileName: 'symphony-standalone-spec.ts',
		exportName: 'symphonyStandaloneSpec',
		id: 'SymphonyStandalone',
		featureName: 'Maestro Symphony',
		runtimeSeconds: 45,
	},
	{
		fileName: 'director-notes-standalone-spec.ts',
		exportName: 'directorNotesStandaloneSpec',
		id: 'DirectorNotesStandalone',
		featureName: "Director's Notes",
		runtimeSeconds: 40,
	},
	{
		fileName: 'worktree-spin-offs-standalone-spec.ts',
		exportName: 'worktreeSpinOffsStandaloneSpec',
		id: 'WorktreeSpinOffsStandalone',
		featureName: 'Run in Worktree',
		runtimeSeconds: 35,
	},
] as const;

describe('storyboard production artifacts', () => {
	it('creates one structured storyboard markdown per standalone feature', () => {
		for (const storyboardDoc of storyboardDocs) {
			const docPath = resolve(storyboardDir, storyboardDoc.fileName);

			expect(existsSync(docPath)).toBe(true);

			const doc = readFileSync(docPath, 'utf8');

			expect(doc.startsWith('---\n')).toBe(true);
			expect(doc).toContain('type: analysis');
			expect(doc).toContain(`title: ${storyboardDoc.title}`);

			for (const column of requiredStoryboardColumns) {
				expect(doc).toContain(column);
			}

			for (const phrase of storyboardDoc.requiredPhrases) {
				expect(doc).toContain(phrase);
			}
		}
	});

	it('creates matching standalone specs with storyboard, capture, ratio, and asset metadata', async () => {
		for (const specModule of standaloneSpecModules) {
			const specPath = resolve(specsDir, specModule.fileName);

			expect(existsSync(specPath)).toBe(true);

			const module = await import(pathToFileURL(specPath).href);
			const spec = module[specModule.exportName];

			expect(spec).toBeDefined();
			expect(spec.id).toBe(specModule.id);
			expect(spec.featureName).toBe(specModule.featureName);
			expect(spec.runtimeSeconds).toBe(specModule.runtimeSeconds);
			expect(spec.fps).toBe(30);
			expect(spec.scenes.length).toBeGreaterThanOrEqual(6);
			expect(spec.scenes.length).toBeLessThanOrEqual(10);
			expect(spec.aspectRatioIntent.primary).toBe('16:9');
			expect(
				spec.aspectRatioIntent.adaptations.map((entry: { ratio: string }) => entry.ratio)
			).toEqual(['1:1', '9:16']);
			expect(spec.assetPlaceholders.length).toBeGreaterThan(0);
			expect(() => validateVideoSpec(spec)).not.toThrow();

			for (const scene of spec.scenes) {
				expect(scene.storyboard).toBeDefined();
				expect(scene.storyboard.sceneNumber).toBeGreaterThan(0);
				expect(scene.storyboard.onScreenCopy.length).toBeGreaterThan(0);
				expect(scene.storyboard.visualComposition.length).toBeGreaterThan(0);
				expect(scene.storyboard.uiStateShown.length).toBeGreaterThan(0);
				expect(scene.storyboard.userAction.length).toBeGreaterThan(0);
				expect(scene.storyboard.systemResponse.length).toBeGreaterThan(0);
				expect(scene.storyboard.motionStyle.length).toBeGreaterThan(0);
				expect(scene.storyboard.durationSeconds).toBeGreaterThan(0);
				expect(scene.assetPlaceholderIds.length).toBeGreaterThan(0);
			}
		}
	});
});
