import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { standaloneFeatureSpecs } from '../src/data/specs';
import {
	buildFeatureCaptureManifest,
	buildFfmpegTrimCommand,
	extractCaptureAssetMetadata,
} from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

describe('capture pipeline', () => {
	it('builds a structured manifest scaffold for each standalone feature spec', () => {
		for (const spec of standaloneFeatureSpecs) {
			const manifest = buildFeatureCaptureManifest(spec);

			expect(() => FeatureCaptureManifestSchema.parse(manifest)).not.toThrow();
			expect(manifest.sceneMappings).toHaveLength(spec.scenes.length);
			expect(manifest.assets).toHaveLength(spec.assetPlaceholders?.length ?? 0);
			expect(manifest.status).toBe('planned');

			for (const sceneMapping of manifest.sceneMappings) {
				expect(sceneMapping.captureIds.length).toBeGreaterThan(0);
				expect(sceneMapping.assetPlaceholderIds.length).toBeGreaterThan(0);
				expect(sceneMapping.recordingPath).toMatch(
					new RegExp(`^capture/recordings/${manifest.featureSlug}/s\\d{2}-`)
				);
				expect(sceneMapping.cropPlan.map((entry) => entry.ratio)).toEqual(['16:9', '1:1', '9:16']);
			}
		}
	});

	it('extracts capture-path metadata and prepares ffmpeg trim commands', () => {
		const metadata = extractCaptureAssetMetadata('capture/live/symphony/create-agent.mov');

		expect(metadata.bucket).toBe('live');
		expect(metadata.featureSlug).toBe('symphony');
		expect(metadata.stem).toBe('create-agent');
		expect(metadata.extension).toBe('mov');
		expect(metadata.mediaType).toBe('video');

		const command = buildFfmpegTrimCommand({
			inputPath: 'capture/recordings/symphony/take-01.mov',
			outputPath: 'capture/live/symphony/create-agent.mov',
			trimStartSeconds: 1.5,
			trimDurationSeconds: 6,
			fps: 30,
			crop: {
				width: 1080,
				height: 1080,
				x: 420,
				y: 0,
			},
		});

		expect(command).toEqual([
			'ffmpeg',
			'-y',
			'-ss',
			'1.500',
			'-i',
			'capture/recordings/symphony/take-01.mov',
			'-t',
			'6.000',
			'-vf',
			'crop=1080:1080:420:0,fps=30',
			'capture/live/symphony/create-agent.mov',
		]);
	});

	it('ships the capture scaffold and validation script inside the isolated workspace', () => {
		expect(existsSync(resolve(workspaceRoot, 'capture/live'))).toBe(true);
		expect(existsSync(resolve(workspaceRoot, 'capture/docs'))).toBe(true);
		expect(existsSync(resolve(workspaceRoot, 'capture/derived'))).toBe(true);
		expect(existsSync(resolve(workspaceRoot, 'capture/manifests'))).toBe(true);
		expect(existsSync(resolve(workspaceRoot, 'capture/recordings'))).toBe(true);
		expect(existsSync(resolve(workspaceRoot, 'docs/research/feature-capture-plan.md'))).toBe(true);

		const result = spawnSync('pnpm', ['validate:capture'], {
			cwd: workspaceRoot,
			encoding: 'utf8',
		});

		expect(result.status, result.stderr).toBe(0);
		expect(result.stdout).toContain('Capture pipeline validation passed');
	});
});
