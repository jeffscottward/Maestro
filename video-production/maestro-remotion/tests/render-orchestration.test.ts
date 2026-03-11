import { describe, expect, it } from 'vitest';

import {
	DELIVERY_RENDER_ENTRY_FILE,
	DELIVERY_RENDER_ROOT,
	DELIVERY_RENDER_VERSION,
	buildDeliveryRenderMatrix,
	getDefaultDeliveryManifestPath,
} from '../src/lib/render-orchestration';

describe('render orchestration', () => {
	it('builds the full standalone delivery matrix with traceable file paths and commands', () => {
		const manifest = buildDeliveryRenderMatrix();

		expect(manifest.entryFile).toBe(DELIVERY_RENDER_ENTRY_FILE);
		expect(manifest.renderRoot).toBe(DELIVERY_RENDER_ROOT);
		expect(manifest.version).toBe(DELIVERY_RENDER_VERSION);
		expect(manifest.manifestPath).toBe(getDefaultDeliveryManifestPath());
		expect(manifest.targetCount).toBe(9);
		expect(manifest.filters.featureSlugs).toEqual(['symphony', 'director-notes', 'worktree']);
		expect(manifest.filters.aspectRatios).toEqual(['16:9', '1:1', '9:16']);
		expect(manifest.targets.map((target) => target.traceId)).toEqual([
			'symphony-standalone-16x9-30fps-v1',
			'symphony-standalone-1x1-30fps-v1',
			'symphony-standalone-9x16-30fps-v1',
			'director-notes-standalone-16x9-30fps-v1',
			'director-notes-standalone-1x1-30fps-v1',
			'director-notes-standalone-9x16-30fps-v1',
			'worktree-spin-offs-standalone-16x9-30fps-v1',
			'worktree-spin-offs-standalone-1x1-30fps-v1',
			'worktree-spin-offs-standalone-9x16-30fps-v1',
		]);

		const verticalDirectorNotes = manifest.targets.find(
			(target) => target.compositionId === 'DirectorNotesStandaloneVertical'
		);

		expect(verticalDirectorNotes).toBeDefined();
		expect(verticalDirectorNotes?.outputPath).toBe(
			'renders/delivery/director-notes/9x16/v1/director-notes-standalone-9x16-30fps-v1.mp4'
		);
		expect(verticalDirectorNotes?.width).toBe(1080);
		expect(verticalDirectorNotes?.height).toBe(1920);
		expect(verticalDirectorNotes?.renderCommand).toBe(
			'pnpm exec remotion render src/index.ts DirectorNotesStandaloneVertical renders/delivery/director-notes/9x16/v1/director-notes-standalone-9x16-30fps-v1.mp4'
		);
	});

	it('filters the matrix by feature selector and aspect ratio without forking composition metadata', () => {
		const manifest = buildDeliveryRenderMatrix({
			featureSelectors: ['director-notes'],
			aspectRatios: ['9:16'],
			version: 'v2',
			renderRoot: 'renders/qa',
		});

		expect(manifest.targetCount).toBe(1);
		expect(manifest.filters.featureSlugs).toEqual(['director-notes']);
		expect(manifest.filters.aspectRatios).toEqual(['9:16']);
		expect(manifest.targets[0]).toMatchObject({
			specId: 'DirectorNotesStandalone',
			compositionId: 'DirectorNotesStandaloneVertical',
			aspectRatio: '9:16',
			variantKey: '9x16',
			version: 'v2',
			outputDirectory: 'renders/qa/director-notes/9x16/v2',
			filename: 'director-notes-standalone-9x16-30fps-v2.mp4',
		});
	});
});
