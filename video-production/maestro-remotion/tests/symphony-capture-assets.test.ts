import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { symphonyStandaloneSpec } from '../src/data/specs';
import { buildFeatureCaptureManifest } from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe('Symphony capture asset integration', () => {
	it('promotes each Symphony fallback asset to a concrete checked-in source path', () => {
		const scaffold = buildFeatureCaptureManifest(symphonyStandaloneSpec);
		const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

		expect(manifest.assets.map((asset) => [asset.id, asset.capturedPath])).toEqual([
			['symphony-projects-hero', 'capture/docs/symphony/projects-browse-reference.png'],
			['symphony-doc-preview-inset', 'capture/docs/symphony/issue-detail-reference.png'],
			['symphony-create-agent-focus', 'capture/docs/symphony/create-agent-reference.png'],
			['symphony-automation-checklist', 'capture/derived/symphony/setup-checklist.json'],
			['symphony-active-card-proof', 'capture/docs/symphony/active-card-reference.png'],
			['symphony-history-proof', 'capture/docs/symphony/history-proof-reference.png'],
			['symphony-stats-proof', 'capture/docs/symphony/stats-proof-reference.png'],
		]);

		for (const asset of manifest.assets) {
			expect(asset.capturedPath).toBeTruthy();
			expect(existsSync(resolve(workspaceRoot, asset.capturedPath!))).toBe(true);
		}
	});

	it('tracks both history and stats proof assets on the Symphony closing scene', () => {
		const closingScene = symphonyStandaloneSpec.scenes.find(
			(scene) => scene.id === 'symphony-standalone-history-stats'
		);

		expect(closingScene?.assetPlaceholderIds).toEqual([
			'symphony-history-proof',
			'symphony-stats-proof',
		]);
	});
});
