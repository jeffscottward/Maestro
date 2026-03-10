import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
	SymphonySurfaceShowcase,
	getSymphonySceneVariant,
} from '../src/components/SymphonySurfaceShowcase';
import { symphonyPrototypeSpec, symphonyStandaloneSpec } from '../src/data/specs';
import { MAESTRO_SURFACE_THEMES } from '../src/lib/maestroVisualSystem';
import { getCapturesForScene } from '../src/lib/timeline';

vi.mock('remotion', async () => {
	const actual = await vi.importActual<typeof import('remotion')>('remotion');

	return {
		...actual,
		useCurrentFrame: () => 12,
	};
});

const symphonyTheme = MAESTRO_SURFACE_THEMES.symphony;

const renderScene = (
	spec: typeof symphonyPrototypeSpec | typeof symphonyStandaloneSpec,
	sceneId: string
) => {
	const scene = spec.scenes.find((candidate) => candidate.id === sceneId);

	if (!scene) {
		throw new Error(`Missing scene: ${sceneId}`);
	}

	return renderToStaticMarkup(
		createElement(SymphonySurfaceShowcase, {
			scene,
			captures: getCapturesForScene(spec, scene),
			progress: 0.74,
			theme: symphonyTheme,
		})
	);
};

describe('Symphony surface showcase', () => {
	it('maps prototype and standalone scenes to distinct Symphony UI states', () => {
		expect(
			symphonyPrototypeSpec.scenes.map((scene) => [scene.id, getSymphonySceneVariant(scene)])
		).toEqual([
			['symphony-projects-overview', 'projects-browse'],
			['symphony-create-agent-flow', 'create-agent'],
		]);

		expect(
			symphonyStandaloneSpec.scenes.map((scene) => [scene.id, getSymphonySceneVariant(scene)])
		).toEqual([
			['symphony-standalone-projects-browse', 'projects-browse'],
			['symphony-standalone-issue-detail', 'issue-detail'],
			['symphony-standalone-create-agent', 'create-agent'],
			['symphony-standalone-setup-proof', 'setup-proof'],
			['symphony-standalone-active-proof', 'active-proof'],
			['symphony-standalone-history-stats', 'history-stats'],
		]);
	});

	it('renders the issue-detail state with blocked issues and Auto Run document preview context', () => {
		const markup = renderScene(symphonyStandaloneSpec, 'symphony-standalone-issue-detail');

		expect(markup).toContain('Available Issues');
		expect(markup).toContain('Blocked');
		expect(markup).toContain('Auto Run Docs');
		expect(markup).toContain('Refine keyboard-first worktree naming');
	});

	it('renders the setup-proof state with draft PR and Auto Run staging milestones', () => {
		const markup = renderScene(symphonyStandaloneSpec, 'symphony-standalone-setup-proof');

		expect(markup).toContain('Create Symphony Agent');
		expect(markup).toContain('Draft PR created');
		expect(markup).toContain('Auto Run Docs staged');
		expect(markup).toContain('Check PR Status');
	});

	it('renders active and closing proof states with live contribution and outcome metrics', () => {
		const activeMarkup = renderScene(symphonyStandaloneSpec, 'symphony-standalone-active-proof');
		const closingMarkup = renderScene(symphonyStandaloneSpec, 'symphony-standalone-history-stats');

		expect(activeMarkup).toContain('Running');
		expect(activeMarkup).toContain('Draft PR #160');
		expect(activeMarkup).toContain('Finalize PR');
		expect(activeMarkup).toContain('Check PR Status');

		expect(closingMarkup).toContain('History');
		expect(closingMarkup).toContain('Stats');
		expect(closingMarkup).toContain('PRs Created');
		expect(closingMarkup).toContain('Achievements');
	});
});
