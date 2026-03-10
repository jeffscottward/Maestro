import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FUTURE_PLANNING_LINKS, MAESTRO_SOURCE_REFERENCES, PRESERVED_TERMINOLOGY } from '../src/lib/projectSources';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const researchDocPath = resolve(workspaceRoot, 'docs/research/project-sources.md');

describe('project sources research artifact', () => {
	it('captures the full source-of-truth reference list from the playbook task', () => {
		expect(MAESTRO_SOURCE_REFERENCES).toEqual([
			'docs/autorun-playbooks.md',
			'docs/director-notes.md',
			'docs/symphony.md',
			'docs/git-worktrees.md',
			'src/shared/themes.ts',
			'src/renderer/components/SymphonyModal.tsx',
			'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
			'src/renderer/components/AutoRunSetupModal.tsx',
			'src/renderer/components/WorktreeRunSection.tsx',
		]);
	});

	it('preserves the Maestro terminology and planning links needed for later phases', () => {
		expect(PRESERVED_TERMINOLOGY).toEqual([
			'Maestro Symphony',
			"Director's Notes",
			'Run in Worktree',
			'Dispatch to a separate worktree',
		]);
		expect(FUTURE_PLANNING_LINKS).toEqual([
			'[[master-production-plan]]',
			'[[phase-01-prototype-report]]',
			'[[symphony-prototype-plan]]',
			'[[director-notes-prototype-plan]]',
			'[[worktree-spin-offs-prototype-plan]]',
		]);
	});

	it('stores the research note with YAML front matter and exact source references', () => {
		const doc = readFileSync(researchDocPath, 'utf8');

		expect(doc.startsWith('---\n')).toBe(true);
		expect(doc).toContain('type: research');
		expect(doc).toContain('title: Maestro Remotion Project Sources');

		for (const sourcePath of MAESTRO_SOURCE_REFERENCES) {
			expect(doc).toContain(`\`${sourcePath}\``);
		}

		for (const label of PRESERVED_TERMINOLOGY) {
			expect(doc).toContain(`\`${label}\``);
		}

		for (const link of FUTURE_PLANNING_LINKS) {
			expect(doc).toContain(link);
		}
	});
});
