/* global console, process */

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const workspaceRoot = process.cwd();
const requireFromWorkspace = createRequire(resolve(workspaceRoot, 'package.json'));

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
	'src/assets',
	'src/lib',
	'src/compositions/MaestroWorkspaceBootstrapComposition.tsx',
	'src/scenes/FeatureHeroScene.tsx',
	'src/components/ProductionFrame.tsx',
	'src/ui/MetaBadge.tsx',
	'src/animations/motion.ts',
	'src/data/production-schema.ts',
	'src/data/workspace-bootstrap-spec.ts',
	'src/lib/composition-registry.ts',
	'src/lib/maestroVisualSystem.ts',
	'src/lib/timeline.ts',
	'src/ui/MaestroPrimitives.tsx',
	'src/components/FeatureSurfaceShowcase.tsx',
	'renders',
	'docs/research/project-sources.md',
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

const missingFiles = requiredPaths.filter(
	(relativePath) => !existsSync(resolve(workspaceRoot, relativePath))
);

if (missingFiles.length > 0) {
	console.error(`Missing required workspace files:\n- ${missingFiles.join('\n- ')}`);
	process.exit(1);
}

const packageJson = JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf8'));
if (packageJson.name !== '@maestro/video-production-remotion') {
	console.error(
		'Workspace package name must stay isolated under @maestro/video-production-remotion.'
	);
	process.exit(1);
}

if (!String(packageJson.packageManager ?? '').startsWith('pnpm@')) {
	console.error('Workspace must declare pnpm as its package manager.');
	process.exit(1);
}

const remotionCliVersion =
	packageJson.dependencies?.['@remotion/cli'] ?? packageJson.devDependencies?.['@remotion/cli'];

if (!remotionCliVersion) {
	console.error(
		'Workspace must include @remotion/cli so the studio and render scripts are runnable.'
	);
	process.exit(1);
}

const zodVersion = packageJson.dependencies?.zod ?? packageJson.devDependencies?.zod;

if (zodVersion !== '4.3.6') {
	console.error(
		'Workspace must pin zod to 4.3.6 so Remotion resolves local dependencies instead of the repo root.'
	);
	process.exit(1);
}

const zodPackagePath = requireFromWorkspace.resolve('zod/package.json');

if (!zodPackagePath.startsWith(workspaceRoot)) {
	console.error(`zod must resolve inside the isolated workspace, got: ${zodPackagePath}`);
	process.exit(1);
}

const researchDoc = readFileSync(
	resolve(workspaceRoot, 'docs/research/project-sources.md'),
	'utf8'
);

for (const sourcePath of requiredSourceReferences) {
	if (!researchDoc.includes(`\`${sourcePath}\``)) {
		console.error(`Research note is missing source reference: ${sourcePath}`);
		process.exit(1);
	}
}

for (const label of requiredLabels) {
	if (!researchDoc.includes(`\`${label}\``)) {
		console.error(`Research note is missing preserved terminology: ${label}`);
		process.exit(1);
	}
}

for (const link of requiredPlanningLinks) {
	if (!researchDoc.includes(link)) {
		console.error(`Research note is missing planning link: ${link}`);
		process.exit(1);
	}
}

console.log('Workspace validation passed');
