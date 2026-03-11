/* global console, process */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

import {
	buildDeliveryRenderMatrix,
	getDefaultDeliveryManifestPath,
} from '../src/lib/render-orchestration.ts';

const workspaceRoot = process.cwd();

const fail = (message) => {
	throw new Error(message);
};

const toList = (value) =>
	(Array.isArray(value) ? value : value ? [value] : [])
		.flatMap((item) => item.split(','))
		.map((item) => item.trim())
		.filter(Boolean);

const resolveWorkspacePath = (targetPath) => resolve(workspaceRoot, targetPath);

const printPlanSummary = (manifest) => {
	console.log(`Planned ${manifest.targetCount} render target(s).`);
	console.log(`Manifest: ${manifest.manifestPath}`);

	for (const target of manifest.targets) {
		console.log(
			`- ${target.compositionId} -> ${target.outputPath} (${target.aspectRatio}, ${target.fps} fps, ${target.version})`
		);
	}
};

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: {
		feature: {
			type: 'string',
			multiple: true,
		},
		'aspect-ratio': {
			type: 'string',
			multiple: true,
		},
		version: {
			type: 'string',
		},
		'output-root': {
			type: 'string',
		},
		'manifest-path': {
			type: 'string',
		},
		overwrite: {
			type: 'boolean',
			default: false,
		},
	},
});

const command = positionals[0] ?? 'plan';

if (!['plan', 'render'].includes(command)) {
	fail(`Unknown command "${command}". Expected "plan" or "render".`);
}

try {
	const version = values.version;
	const manifestPath = values['manifest-path'] ?? getDefaultDeliveryManifestPath(version);
	const manifest = buildDeliveryRenderMatrix({
		featureSelectors: toList(values.feature),
		aspectRatios: toList(values['aspect-ratio']),
		version,
		renderRoot: values['output-root'],
		manifestPath,
	});
	const manifestDiskPath = resolveWorkspacePath(manifest.manifestPath);

	mkdirSync(dirname(manifestDiskPath), {
		recursive: true,
	});
	writeFileSync(manifestDiskPath, `${JSON.stringify(manifest, null, 2)}\n`);
	printPlanSummary(manifest);

	if (command === 'render') {
		let renderedCount = 0;
		let skippedCount = 0;

		for (const target of manifest.targets) {
			const outputDiskPath = resolveWorkspacePath(target.outputPath);

			if (existsSync(outputDiskPath) && !values.overwrite) {
				console.log(`Skipping existing render: ${target.outputPath}`);
				skippedCount += 1;
				continue;
			}

			mkdirSync(dirname(outputDiskPath), {
				recursive: true,
			});

			console.log(`Rendering ${target.compositionId} -> ${target.outputPath}`);

			const result = spawnSync(
				'pnpm',
				['exec', 'remotion', 'render', manifest.entryFile, target.compositionId, outputDiskPath],
				{
					cwd: workspaceRoot,
					stdio: 'inherit',
				}
			);

			if (result.status !== 0) {
				fail(`Render failed for ${target.compositionId} (${target.outputPath}).`);
			}

			renderedCount += 1;
		}

		console.log(
			`Render matrix finished. Rendered ${renderedCount} target(s); skipped ${skippedCount} existing target(s).`
		);
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
