import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { standaloneFeatureSpecs } from '../src/data/specs';
import { buildFeatureCaptureManifest } from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe('capture source material manifests', () => {
	it('resolve every planned scene source to a concrete collected input', () => {
		for (const spec of standaloneFeatureSpecs) {
			const scaffold = buildFeatureCaptureManifest(spec);
			const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

			expect(manifest.status).toBe('in-progress');

			for (const source of manifest.sceneMappings.flatMap((scene) => scene.sources)) {
				expect(source.sourceStatus).toBe('resolved');
				expect(source.resolvedSourcePath).toBeTruthy();
				expect(source.notes).toMatch(/Source type:/);
				expect(existsSync(resolve(workspaceRoot, source.resolvedSourcePath!))).toBe(true);
			}
		}
	});

	it('ships the source-material log and reconstruction notes used by unresolved live states', () => {
		const requiredFiles = [
			'docs/research/phase-02-source-material-log.md',
			'docs/research/reconstructions/symphony-setup-proof-reconstruction.md',
			'docs/research/reconstructions/director-notes-history-detail-reconstruction.md',
			'docs/research/reconstructions/director-notes-ai-overview-loading-reconstruction.md',
			'docs/research/reconstructions/director-notes-evidence-link-reconstruction.md',
			'docs/research/reconstructions/worktree-terminal-proof-reconstruction.md',
		];

		for (const relativePath of requiredFiles) {
			expect(existsSync(resolve(workspaceRoot, relativePath))).toBe(true);
		}
	});
});
