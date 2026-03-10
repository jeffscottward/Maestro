export const MAESTRO_SOURCE_REFERENCES = [
	'docs/autorun-playbooks.md',
	'docs/director-notes.md',
	'docs/symphony.md',
	'docs/git-worktrees.md',
	'src/shared/themes.ts',
	'src/renderer/components/SymphonyModal.tsx',
	'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx',
	'src/renderer/components/AutoRunSetupModal.tsx',
	'src/renderer/components/WorktreeRunSection.tsx',
] as const;

export const PRESERVED_TERMINOLOGY = [
	'Maestro Symphony',
	"Director's Notes",
	'Run in Worktree',
	'Dispatch to a separate worktree',
	'Create Pull Request',
] as const;

export const FUTURE_PLANNING_LINKS = [
	'[[master-production-plan]]',
	'[[phase-01-prototype-report]]',
	'[[symphony-prototype-plan]]',
	'[[director-notes-prototype-plan]]',
	'[[worktree-spin-offs-prototype-plan]]',
] as const;
