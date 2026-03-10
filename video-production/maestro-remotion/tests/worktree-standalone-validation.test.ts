import { describe, expect, it } from 'vitest';

import { validateVideoSpec } from '../src/data/production-schema';
import { worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import { validateVideoSpecCompleteness } from '../src/lib/production-validation';
import { getCapturesForScene } from '../src/lib/timeline';

const REQUIRED_WORKTREE_SCENE_IDS = [
	'worktree-standalone-risk',
	'worktree-standalone-toggle',
	'worktree-standalone-create-form',
	'worktree-standalone-pr-intent',
	'worktree-standalone-inventory',
	'worktree-standalone-terminal-proof',
] as const;

const EXPECTED_SCENE_CAPTURE_IDS = [
	['worktree-standalone-risk', ['worktree-batch-runner']],
	['worktree-standalone-toggle', ['worktree-toggle-enabled']],
	['worktree-standalone-create-form', ['worktree-create-new-form']],
	['worktree-standalone-pr-intent', ['worktree-create-new-form', 'worktree-pr-intent']],
	['worktree-standalone-inventory', ['worktree-inventory-proof']],
	['worktree-standalone-terminal-proof', ['worktree-terminal-proof']],
] as const;

describe('Worktree standalone validation', () => {
	it('keeps the approved Worktree Spin-offs scene IDs and storyboard order locked', () => {
		expect(worktreeSpinOffsStandaloneSpec.scenes.map((scene) => scene.id)).toEqual(
			REQUIRED_WORKTREE_SCENE_IDS
		);
		expect(
			worktreeSpinOffsStandaloneSpec.scenes.map((scene) => scene.storyboard?.sceneNumber ?? null)
		).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('keeps the worktree terminology and narrative states aligned with the shipped feature', () => {
		expect(worktreeSpinOffsStandaloneSpec.terminology).toEqual(
			expect.arrayContaining([
				'Run in Worktree',
				'Dispatch to a separate worktree',
				'Create New Worktree',
				'Base Branch',
				'Worktree Branch Name',
				'Automatically create PR when complete',
				'Create Pull Request',
				'Open in Maestro',
				'Available Worktrees',
				'Worktree Directory',
			])
		);
		expect(
			worktreeSpinOffsStandaloneSpec.scenes.map((scene) => [
				scene.id,
				scene.storyboard?.uiStateShown ?? '',
			])
		).toEqual([
			['worktree-standalone-risk', 'Auto Run run-launch surface in a git-backed session.'],
			[
				'worktree-standalone-toggle',
				'`Run in Worktree` section expanding from collapsed to enabled.',
			],
			[
				'worktree-standalone-create-form',
				'Create-new worktree mode with `Base Branch`, `Worktree Branch Name`, and directory preview.',
			],
			[
				'worktree-standalone-pr-intent',
				'Create-new mode with PR option enabled and path preview still visible.',
			],
			[
				'worktree-standalone-inventory',
				'Open or available worktree inventory with supporting config context.',
			],
			[
				'worktree-standalone-terminal-proof',
				'Run launched in the worktree with terminal and branch context visible.',
			],
		]);
	});

	it('keeps the standalone spec schema-valid and production-complete', () => {
		expect(() => validateVideoSpec(worktreeSpinOffsStandaloneSpec)).not.toThrow();
		expect(validateVideoSpecCompleteness(worktreeSpinOffsStandaloneSpec)).toEqual([]);
	});

	it('maps the expected capture states onto each rendered Worktree scene', () => {
		expect(
			worktreeSpinOffsStandaloneSpec.scenes.map((scene) => [
				scene.id,
				getCapturesForScene(worktreeSpinOffsStandaloneSpec, scene).map((capture) => capture.id),
			])
		).toEqual(EXPECTED_SCENE_CAPTURE_IDS);
	});
});
