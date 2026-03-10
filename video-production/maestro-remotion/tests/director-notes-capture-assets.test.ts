import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { directorNotesStandaloneSpec } from '../src/data/specs';
import { buildFeatureCaptureManifest } from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe("Director's Notes capture asset integration", () => {
	it('keeps the checked-in capture definitions synchronized with the standalone spec', () => {
		const scaffold = buildFeatureCaptureManifest(directorNotesStandaloneSpec);
		const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

		expect(manifest.captures).toEqual(directorNotesStandaloneSpec.capturePlan);
	});

	it('promotes each Director Notes fallback asset to a concrete checked-in source path', () => {
		const scaffold = buildFeatureCaptureManifest(directorNotesStandaloneSpec);
		const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

		expect(manifest.assets.map((asset) => [asset.id, asset.capturedPath])).toEqual([
			['director-modal-shell', 'capture/docs/director-notes/unified-history-reference.png'],
			['director-history-controls', 'capture/docs/director-notes/unified-history-reference.png'],
			['director-history-detail-card', 'capture/derived/director-notes/history-detail-proof.json'],
			[
				'director-ai-overview-loading-card',
				'capture/derived/director-notes/ai-overview-loading-proof.json',
			],
			[
				'director-ai-overview-ready-card',
				'capture/docs/director-notes/ai-overview-ready-reference.png',
			],
			['director-grounded-synthesis-overlay', 'capture/derived/director-notes/evidence-link.json'],
		]);

		for (const asset of manifest.assets) {
			expect(asset.capturedPath).toBeTruthy();
			expect(existsSync(resolve(workspaceRoot, asset.capturedPath!))).toBe(true);
		}
	});

	it('tracks the history, ready-state, and evidence-link assets on the closing scene', () => {
		const closingScene = directorNotesStandaloneSpec.scenes.find(
			(scene) => scene.id === 'director-notes-standalone-close'
		);

		expect(closingScene?.assetPlaceholderIds).toEqual([
			'director-history-controls',
			'director-ai-overview-ready-card',
			'director-grounded-synthesis-overlay',
		]);
	});
});
