/* global console, process */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema.ts';
import { standaloneFeatureSpecs } from '../src/data/specs/index.ts';
import {
	CAPTURE_BUCKETS,
	buildFeatureCaptureManifest,
	validateFeatureCaptureManifest,
} from '../src/lib/capture-pipeline.ts';

const workspaceRoot = process.cwd();

const requiredPaths = [
	'capture/live',
	'capture/docs',
	'capture/derived',
	'capture/manifests',
	'capture/recordings',
	'docs/research/feature-capture-plan.md',
	'scripts/export-capture-manifests.mjs',
	'scripts/validate-capture-pipeline.mjs',
	'src/data/capture-schema.ts',
	'src/lib/capture-pipeline.ts',
];

const requiredDocPhrases = [
	'[[master-production-plan]]',
	'[[project-sources]]',
	'`pnpm capture:manifests`',
	'`pnpm validate:capture`',
];

const fail = (message) => {
	throw new Error(message);
};

const readWorkspaceFile = (relativePath) =>
	readFileSync(resolve(workspaceRoot, relativePath), 'utf8');

export const validateCapturePipeline = () => {
	const missingPaths = requiredPaths.filter(
		(relativePath) => !existsSync(resolve(workspaceRoot, relativePath))
	);

	if (missingPaths.length > 0) {
		fail(`Missing required capture pipeline files:\n- ${missingPaths.join('\n- ')}`);
	}

	const packageJson = JSON.parse(readWorkspaceFile('package.json'));
	const captureManifestScript = packageJson.scripts?.['capture:manifests'];
	const validateCaptureScript = packageJson.scripts?.['validate:capture'];

	if (!captureManifestScript) {
		fail('Workspace must expose a capture:manifests script for writing manifest scaffolds.');
	}

	if (!validateCaptureScript) {
		fail('Workspace must expose a validate:capture script for capture pipeline validation.');
	}

	const capturePlanDoc = readWorkspaceFile('docs/research/feature-capture-plan.md');

	for (const phrase of requiredDocPhrases) {
		if (!capturePlanDoc.includes(phrase)) {
			fail(`Capture plan doc is missing required phrase: ${phrase}`);
		}
	}

	const issues = [];

	for (const bucket of CAPTURE_BUCKETS) {
		const bucketPath = resolve(workspaceRoot, `capture/${bucket}`);
		if (!existsSync(bucketPath)) {
			issues.push(`Capture bucket is missing: capture/${bucket}`);
		}
	}

	for (const spec of standaloneFeatureSpecs) {
		const expectedManifest = buildFeatureCaptureManifest(spec);
		const manifestPath = resolve(workspaceRoot, expectedManifest.manifestPath);

		if (!existsSync(manifestPath)) {
			issues.push(
				`${spec.id}: missing checked-in manifest scaffold at ${expectedManifest.manifestPath}`
			);
			continue;
		}

		let parsedManifest;

		try {
			const manifestJson = JSON.parse(readWorkspaceFile(expectedManifest.manifestPath));
			parsedManifest = FeatureCaptureManifestSchema.parse(manifestJson);
		} catch (error) {
			issues.push(
				`${spec.id}: manifest must parse against FeatureCaptureManifestSchema (${error instanceof Error ? error.message : String(error)})`
			);
			continue;
		}

		issues.push(...validateFeatureCaptureManifest(parsedManifest, spec));
	}

	if (issues.length > 0) {
		fail(`Capture pipeline validation failed:\n- ${issues.join('\n- ')}`);
	}

	return 'Capture pipeline validation passed';
};

try {
	console.log(validateCapturePipeline());
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
