import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { FeatureCaptureManifestSchema } from '../src/data/capture-schema';
import { standaloneFeatureSpecs } from '../src/data/specs';
import {
	buildFeatureCaptureManifest,
	validateFeatureCaptureReadiness,
} from '../src/lib/capture-pipeline';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const phase02ReadinessReportPath = resolve(
	workspaceRoot,
	'docs/reports/phase-02-capture-readiness.md'
);

const readJson = (relativePath: string) =>
	JSON.parse(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));

describe('capture readiness coverage', () => {
	it('declares a resolved visual source and declared fallback path for every planned scene', () => {
		for (const spec of standaloneFeatureSpecs) {
			const scaffold = buildFeatureCaptureManifest(spec);
			const manifest = FeatureCaptureManifestSchema.parse(readJson(scaffold.manifestPath));

			expect(validateFeatureCaptureReadiness(manifest, spec)).toEqual([]);
		}
	});

	it('records scene-implementation readiness and remaining live-capture gaps in Phase 02 reporting', () => {
		expect(existsSync(phase02ReadinessReportPath)).toBe(true);

		const report = readFileSync(phase02ReadinessReportPath, 'utf8');

		expect(report.startsWith('---\n')).toBe(true);
		expect(report).toContain('type: report');
		expect(report).toContain('title: Phase 02 Capture Readiness');
		expect(report).toContain('## Readiness Summary');
		expect(report).toContain('## Feature Status');
		expect(report).toContain('## Unresolved Capture Gaps');
		expect(report).toContain('## Validation Commands');
		expect(report).toContain('[[symphony-feature-research]]');
		expect(report).toContain('[[director-notes-feature-research]]');
		expect(report).toContain('[[worktree-spin-offs-feature-research]]');
		expect(report).toContain('scene implementation');
		expect(report).toContain('`pnpm validate:capture`');
		expect(report).toContain('`capture/docs/symphony/projects-browse-reference.png`');
		expect(report).toContain('`capture/live/director-notes/modal-open.mov`');
		expect(report).toContain('`capture/live/worktree/autorun-batch-runner.mov`');
	});
});
