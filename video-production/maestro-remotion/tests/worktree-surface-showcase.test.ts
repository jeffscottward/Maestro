import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
	WorktreeSurfaceShowcase,
	getWorktreeSceneVariant,
} from '../src/components/WorktreeSurfaceShowcase';
import { worktreeSpinOffsPrototypeSpec, worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import { MAESTRO_SURFACE_THEMES } from '../src/lib/maestroVisualSystem';
import { getCapturesForScene } from '../src/lib/timeline';

vi.mock('remotion', async () => {
	const actual = await vi.importActual<typeof import('remotion')>('remotion');

	return {
		...actual,
		useCurrentFrame: () => 12,
	};
});

const worktreeTheme = MAESTRO_SURFACE_THEMES.worktree;

const renderScene = (
	spec: typeof worktreeSpinOffsPrototypeSpec | typeof worktreeSpinOffsStandaloneSpec,
	sceneId: string,
	progress = 0.82
) => {
	const scene = spec.scenes.find((candidate) => candidate.id === sceneId);

	if (!scene) {
		throw new Error(`Missing scene: ${sceneId}`);
	}

	return renderToStaticMarkup(
		createElement(WorktreeSurfaceShowcase, {
			scene,
			captures: getCapturesForScene(spec, scene),
			progress,
			theme: worktreeTheme,
		})
	);
};

describe('Worktree surface showcase', () => {
	it('maps the prototype and standalone worktree scenes to distinct UI variants', () => {
		expect(
			worktreeSpinOffsPrototypeSpec.scenes.map((scene) => [
				scene.id,
				getWorktreeSceneVariant(scene),
			])
		).toEqual([
			['worktree-dispatch-overview', 'create-form'],
			['worktree-follow-through', 'terminal-proof'],
		]);

		expect(
			worktreeSpinOffsStandaloneSpec.scenes.map((scene) => [
				scene.id,
				getWorktreeSceneVariant(scene),
			])
		).toEqual([
			['worktree-standalone-risk', 'dispatch-overview'],
			['worktree-standalone-toggle', 'toggle-focus'],
			['worktree-standalone-create-form', 'create-form'],
			['worktree-standalone-pr-intent', 'pr-intent'],
			['worktree-standalone-inventory', 'inventory-proof'],
			['worktree-standalone-terminal-proof', 'terminal-proof'],
		]);
	});

	it('renders the Auto Run context and disabled worktree lane for the risk opener', () => {
		const markup = renderScene(worktreeSpinOffsStandaloneSpec, 'worktree-standalone-risk');

		expect(markup).toContain('Change Auto Run Folder');
		expect(markup).toContain('Auto Run Folder');
		expect(markup).toContain('Select Auto Run Folder');
		expect(markup).toContain('Dispatch to a separate worktree');
		expect(markup).toContain('Current checkout');
		expect(markup).toContain('Scene source');
		expect(markup).toContain('capture/docs/worktree/autorun-worktree-reference.png');
	});

	it('renders the create form and PR handoff state with the shipped worktree labels', () => {
		const formMarkup = renderScene(
			worktreeSpinOffsStandaloneSpec,
			'worktree-standalone-create-form'
		);
		const prMarkup = renderScene(worktreeSpinOffsStandaloneSpec, 'worktree-standalone-pr-intent');

		expect(formMarkup).toContain('Create New Worktree');
		expect(formMarkup).toContain('Base Branch');
		expect(formMarkup).toContain('Worktree Branch Name');
		expect(formMarkup).toContain('/Users/pedram/Projects/Maestro-WorkTrees/autorun-spinout');

		expect(prMarkup).toContain('Automatically create PR when complete');
		expect(prMarkup).toContain('Create Pull Request');
		expect(prMarkup).toContain('Review path');
		expect(prMarkup).toContain('capture/docs/worktree/autorun-worktree-reference.png');
	});

	it('keeps the toggle badge aligned with the visual switch state during the toggle reveal', () => {
		const midToggleMarkup = renderScene(
			worktreeSpinOffsStandaloneSpec,
			'worktree-standalone-toggle',
			0.32
		);
		const completedToggleMarkup = renderScene(
			worktreeSpinOffsStandaloneSpec,
			'worktree-standalone-toggle',
			0.82
		);

		expect(midToggleMarkup).toContain('Off');
		expect(midToggleMarkup).not.toContain('Enabled');
		expect(completedToggleMarkup).toContain('Enabled');
	});

	it('renders inventory proof and terminal follow-through states for the isolated lane', () => {
		const inventoryMarkup = renderScene(
			worktreeSpinOffsStandaloneSpec,
			'worktree-standalone-inventory'
		);
		const terminalMarkup = renderScene(
			worktreeSpinOffsStandaloneSpec,
			'worktree-standalone-terminal-proof'
		);

		expect(inventoryMarkup).toContain('Open in Maestro');
		expect(inventoryMarkup).toContain('Available Worktrees');
		expect(inventoryMarkup).toContain('Worktree Directory');
		expect(inventoryMarkup).toContain('Watch for new worktrees');
		expect(inventoryMarkup).toContain('capture/docs/worktree/worktree-inventory-reference.png');
		expect(inventoryMarkup).toContain('capture/docs/worktree/worktree-configuration-reference.png');

		expect(terminalMarkup).toContain('Parent checkout stays clean');
		expect(terminalMarkup).toContain('Create Pull Request');
		expect(terminalMarkup).toContain('autorun-spinout');
		expect(terminalMarkup).toContain('Separate worktree path');
		expect(terminalMarkup).toContain('capture/derived/worktree/terminal-proof.json');
	});
});
