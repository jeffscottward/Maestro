/* global console, process */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { standaloneFeatureSpecs } from '../src/data/specs/index.ts';
import {
	CAPTURE_BUCKETS,
	buildFeatureCaptureManifest,
	serializeCaptureManifest,
} from '../src/lib/capture-pipeline.ts';

const workspaceRoot = process.cwd();

const ensureDirectory = (relativePath) => {
	mkdirSync(resolve(workspaceRoot, relativePath), {
		recursive: true,
	});
};

for (const bucket of CAPTURE_BUCKETS) {
	ensureDirectory(`capture/${bucket}`);
}

for (const spec of standaloneFeatureSpecs) {
	const manifest = buildFeatureCaptureManifest(spec);
	const manifestPath = resolve(workspaceRoot, manifest.manifestPath);

	for (const directory of Object.values(manifest.directories)) {
		ensureDirectory(directory);
	}

	ensureDirectory(dirname(manifest.manifestPath));
	writeFileSync(manifestPath, serializeCaptureManifest(manifest), 'utf8');
	console.log(`Wrote ${manifest.manifestPath}`);
}
