/* global console, process */

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validatePrototypeWorkspace } from '../src/lib/production-validation.ts';

const requiredPaths = [
	'package.json',
	'pnpm-lock.yaml',
	'src/index.ts',
	'src/Root.tsx',
	'src/WorkspaceBootstrap.tsx',
	'src/workspace-metadata.ts',
	'src/compositions',
	'src/scenes',
	'src/components',
	'src/ui',
	'src/animations',
	'src/data',
	'src/data/capture-schema.ts',
	'src/assets',
	'src/lib',
	'src/lib/capture-pipeline.ts',
	'src/lib/final-delivery-qa.ts',
	'src/lib/render-orchestration.ts',
	'src/compositions/MaestroWorkspaceBootstrapComposition.tsx',
	'src/scenes/FeatureHeroScene.tsx',
	'src/components/ProductionFrame.tsx',
	'src/ui/MetaBadge.tsx',
	'src/animations/motion.ts',
	'src/data/production-schema.ts',
	'src/data/workspace-bootstrap-spec.ts',
	'src/lib/composition-registry.ts',
	'src/lib/maestroVisualSystem.ts',
	'src/lib/production-validation.ts',
	'src/lib/timeline.ts',
	'src/ui/MaestroPrimitives.tsx',
	'src/components/FeatureSurfaceShowcase.tsx',
	'scripts/export-capture-manifests.mjs',
	'scripts/validate-delivery-qa.mjs',
	'scripts/render-delivery-matrix.mjs',
	'scripts/validate-capture-pipeline.mjs',
	'capture/live',
	'capture/docs',
	'capture/derived',
	'capture/manifests',
	'capture/recordings',
	'renders',
	'docs/research/project-sources.md',
	'docs/research/feature-capture-plan.md',
	'docs/reports/phase-02-capture-readiness.md',
	'docs/reports/qa',
];

const requiredSourceReferences = [
	'docs/autorun-playbooks.md',
	'docs/director-notes.md',
	'docs/symphony.md',
	'docs/git-worktrees.md',
	'src/shared/themes.ts',
	'src/renderer/components/SymphonyModal.tsx',
	'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
	'src/renderer/components/AutoRunSetupModal.tsx',
	'src/renderer/components/WorktreeRunSection.tsx',
];

const requiredLabels = [
	'Maestro Symphony',
	"Director's Notes",
	'Run in Worktree',
	'Dispatch to a separate worktree',
];

const requiredPlanningLinks = [
	'[[master-production-plan]]',
	'[[phase-01-prototype-report]]',
	'[[symphony-prototype-plan]]',
	'[[director-notes-prototype-plan]]',
	'[[worktree-spin-offs-prototype-plan]]',
];

const fail = (message) => {
	throw new Error(message);
};

const readWorkspaceFile = (workspaceRoot, relativePath) =>
	readFileSync(resolve(workspaceRoot, relativePath), 'utf8');

export const validateWorkspace = () => {
	const workspaceRoot = process.cwd();
	const missingFiles = requiredPaths.filter(
		(relativePath) => !existsSync(resolve(workspaceRoot, relativePath))
	);

	if (missingFiles.length > 0) {
		fail(`Missing required workspace files:\n- ${missingFiles.join('\n- ')}`);
	}

	const packageJson = JSON.parse(readWorkspaceFile(workspaceRoot, 'package.json'));
	if (packageJson.name !== '@maestro/video-production-remotion') {
		fail('Workspace package name must stay isolated under @maestro/video-production-remotion.');
	}

	if (!String(packageJson.packageManager ?? '').startsWith('pnpm@')) {
		fail('Workspace must declare pnpm as its package manager.');
	}

	if (!packageJson.scripts?.['capture:manifests']) {
		fail('Workspace must expose a capture:manifests script for feature manifest scaffolding.');
	}

	if (!packageJson.scripts?.['validate:capture']) {
		fail('Workspace must expose a validate:capture script for capture pipeline validation.');
	}

	if (!packageJson.scripts?.['validate:qa']) {
		fail('Workspace must expose a validate:qa script for final delivery QA validation.');
	}

	if (!packageJson.scripts?.['render:matrix:plan']) {
		fail('Workspace must expose a render:matrix:plan script for delivery matrix planning.');
	}

	if (!packageJson.scripts?.['render:matrix']) {
		fail('Workspace must expose a render:matrix script for full delivery renders.');
	}

	const remotionCliVersion =
		packageJson.dependencies?.['@remotion/cli'] ?? packageJson.devDependencies?.['@remotion/cli'];

	if (!remotionCliVersion) {
		fail('Workspace must include @remotion/cli so the studio and render scripts are runnable.');
	}

	const tsxVersion = packageJson.dependencies?.tsx ?? packageJson.devDependencies?.tsx;

	if (!tsxVersion) {
		fail('Workspace must include tsx so the workspace validator can execute TypeScript modules.');
	}

	const zodVersion = packageJson.dependencies?.zod ?? packageJson.devDependencies?.zod;

	if (zodVersion !== '4.3.6') {
		fail(
			'Workspace must pin zod to 4.3.6 so Remotion resolves local dependencies instead of the repo root.'
		);
	}

	const requireFromWorkspace = createRequire(resolve(workspaceRoot, 'package.json'));
	const zodPackagePath = requireFromWorkspace.resolve('zod/package.json');

	if (!zodPackagePath.startsWith(workspaceRoot)) {
		fail(`zod must resolve inside the isolated workspace, got: ${zodPackagePath}`);
	}

	const researchDoc = readWorkspaceFile(workspaceRoot, 'docs/research/project-sources.md');

	for (const sourcePath of requiredSourceReferences) {
		if (!researchDoc.includes(`\`${sourcePath}\``)) {
			fail(`Research note is missing source reference: ${sourcePath}`);
		}
	}

	for (const label of requiredLabels) {
		if (!researchDoc.includes(`\`${label}\``)) {
			fail(`Research note is missing preserved terminology: ${label}`);
		}
	}

	for (const link of requiredPlanningLinks) {
		if (!researchDoc.includes(link)) {
			fail(`Research note is missing planning link: ${link}`);
		}
	}

	const prototypeValidationIssues = validatePrototypeWorkspace();

	if (prototypeValidationIssues.length > 0) {
		fail(`Prototype validation failed:\n- ${prototypeValidationIssues.join('\n- ')}`);
	}

	return 'Workspace validation passed';
};

const isDirectExecution =
	process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
	try {
		console.log(validateWorkspace());
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
