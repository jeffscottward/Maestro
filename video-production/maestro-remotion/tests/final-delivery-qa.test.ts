import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { symphonyStandaloneSpec } from '../src/data/specs';
import {
	runFinalDeliveryQa,
	validateFeatureAssetCoverage,
	validateSceneLayoutReadability,
} from '../src/lib/final-delivery-qa';
import { createVideoCompositionMetadata } from '../src/lib/aspect-ratio-adaptation';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe('final delivery QA', () => {
	it('passes the automated QA suite for all standalone features', () => {
		const report = runFinalDeliveryQa({ workspaceRoot });

		expect(report.totalIssueCount).toBe(0);
		expect(report.features.map((feature) => feature.featureSlug)).toEqual([
			'symphony',
			'director-notes',
			'worktree',
		]);
		expect(
			report.features.flatMap((feature) =>
				feature.checks
					.filter((check) => check.status !== 'pass')
					.map((check) => `${feature.specId}:${check.id}`)
			)
		).toEqual([]);
	});

	it('flags text overflow and safe-area pressure when scene copy exceeds the authored layout budget', () => {
		const stressedSpec = structuredClone(symphonyStandaloneSpec);
		const storyboard = stressedSpec.scenes[1].storyboard;

		if (!storyboard) {
			throw new Error('Expected the Symphony issue-detail scene to include storyboard metadata.');
		}

		stressedSpec.scenes[1] = {
			...stressedSpec.scenes[1],
			title:
				'This is an intentionally oversized vertical-safe headline that should exceed the authored portrait layout budget for the final delivery QA check',
			body: 'This body copy is intentionally inflated to simulate a late edit that would create stacking pressure, reduce available stage height, and force the scene to violate the safe-area expectations in the portrait adaptation.',
			storyboard: {
				...storyboard,
				onScreenCopy: [
					'This note is intentionally long enough to blow through the card budget for the narrow portrait-safe layout.',
					'This second note compounds the issue by demanding more wrapped lines than the scene shell is supposed to tolerate during QA.',
					'This third note ensures the stacked layout loses too much stage height and should be rejected before render.',
				],
			},
		};

		const issues = validateSceneLayoutReadability({
			spec: stressedSpec,
			scene: stressedSpec.scenes[1],
			composition: createVideoCompositionMetadata(stressedSpec, '9:16'),
		});

		expect(issues).toEqual(
			expect.arrayContaining([
				expect.stringContaining('text overflow'),
				expect.stringContaining('safe-area'),
			])
		);
	});

	it('flags missing capture assets before full delivery', () => {
		const manifest = FeatureCaptureManifestSchema.parse(
			readJson('capture/manifests/symphony/symphony-capture-manifest.json')
		);
		manifest.assets[0] = {
			...manifest.assets[0],
			capturedPath: 'capture/docs/symphony/does-not-exist.png',
		};

		const issues = validateFeatureAssetCoverage({
			spec: symphonyStandaloneSpec,
			manifest,
			workspaceRoot,
		});

		expect(issues).toEqual(expect.arrayContaining([expect.stringContaining('missing asset file')]));
	});
});
