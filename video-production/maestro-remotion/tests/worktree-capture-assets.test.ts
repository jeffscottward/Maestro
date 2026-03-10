import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import { buildFeatureCaptureManifest } from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe('Worktree capture asset integration', () => {
	it('keeps the checked-in capture definitions synchronized with the standalone spec', () => {
		const scaffold = buildFeatureCaptureManifest(worktreeSpinOffsStandaloneSpec);
		const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

		expect(manifest.captures).toEqual(worktreeSpinOffsStandaloneSpec.capturePlan);
	});

	it('promotes each Worktree fallback asset to a concrete checked-in source path', () => {
		const scaffold = buildFeatureCaptureManifest(worktreeSpinOffsStandaloneSpec);
		const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

		expect(manifest.assets.map((asset) => [asset.id, asset.capturedPath])).toEqual([
			['worktree-autorun-context', 'capture/docs/worktree/autorun-worktree-reference.png'],
			['worktree-toggle-focus', 'capture/docs/worktree/autorun-worktree-reference.png'],
			['worktree-create-form', 'capture/docs/worktree/autorun-worktree-reference.png'],
			['worktree-inventory-panel', 'capture/docs/worktree/worktree-inventory-reference.png'],
			[
				'worktree-configuration-context',
				'capture/docs/worktree/worktree-configuration-reference.png',
			],
			['worktree-terminal-card', 'capture/derived/worktree/terminal-proof.json'],
		]);

		for (const asset of manifest.assets) {
			expect(asset.capturedPath).toBeTruthy();
			expect(existsSync(resolve(workspaceRoot, asset.capturedPath!))).toBe(true);
		}
	});

	it('tracks both inventory and configuration proof assets on the inventory scene', () => {
		const inventoryScene = worktreeSpinOffsStandaloneSpec.scenes.find(
			(scene) => scene.id === 'worktree-standalone-inventory'
		);

		expect(inventoryScene?.assetPlaceholderIds).toEqual([
			'worktree-inventory-panel',
			'worktree-configuration-context',
		]);
	});
});
