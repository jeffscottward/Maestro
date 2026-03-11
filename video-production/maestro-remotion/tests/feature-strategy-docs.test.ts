import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const strategyDir = resolve(workspaceRoot, 'docs/strategy');
const approvedStructuresPath = resolve(
	strategyDir,
	'approved-feature-video-narrative-structures.md'
);

const requiredSections = [
	'## Strategy Snapshot',
	'## Narrative Structure',
	'## Why This Structure Fits',
	'## Platform Plan',
	'## Messaging Guardrails',
	'## Final Edit Decisions',
	'## Story Beats',
];

const strategyDocs = [
	{
		fileName: 'symphony-prototype-plan.md',
		title: 'Maestro Symphony Standalone Video Strategy',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[symphony-feature-research]]',
			'[[approved-feature-video-narrative-structures]]',
			'`45 seconds`',
			'Voiceover vs text: `text-led final`',
			'no voiceover, music, or SFX planned in the isolated workspace',
			'Discovery -> Activation -> Proof',
			'`Start Symphony`',
			'`Create Symphony Agent`',
			'`Create Agent`',
			'draft PR',
		],
	},
	{
		fileName: 'director-notes-prototype-plan.md',
		title: "Director's Notes Standalone Video Strategy",
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[director-notes-feature-research]]',
			'[[approved-feature-video-narrative-structures]]',
			'`40 seconds`',
			'Voiceover vs text: `text-led final`',
			'no voiceover, music, or SFX planned in the isolated workspace',
			'Fragmentation -> Visibility -> Synthesis',
			'`Unified History`',
			'`AI Overview`',
			'`Regenerate`',
		],
	},
	{
		fileName: 'worktree-spin-offs-prototype-plan.md',
		title: 'Worktree Spin-offs Standalone Video Strategy',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[worktree-spin-offs-feature-research]]',
			'[[approved-feature-video-narrative-structures]]',
			'`35 seconds`',
			'Voiceover vs text: `text-led final`',
			'no voiceover, music, or SFX planned in the isolated workspace',
			'Risk -> Isolation -> Handoff',
			'`Auto Run Worktree Spin-offs`',
			'`Run in Worktree`',
			'`Dispatch to a separate worktree`',
			'`Automatically create PR when complete`',
		],
	},
] as const;

describe('feature strategy artifacts', () => {
	it('stores the approved narrative structure reference used by the standalone video plans', () => {
		expect(existsSync(approvedStructuresPath)).toBe(true);

		const doc = readFileSync(approvedStructuresPath, 'utf8');

		expect(doc.startsWith('---\n')).toBe(true);
		expect(doc).toContain('type: reference');
		expect(doc).toContain('title: Approved Feature Video Narrative Structures');
		expect(doc).toContain('Discovery -> Activation -> Proof');
		expect(doc).toContain('Fragmentation -> Visibility -> Synthesis');
		expect(doc).toContain('Risk -> Isolation -> Handoff');
	});

	it('creates one structured standalone strategy note per feature video', () => {
		for (const strategyDoc of strategyDocs) {
			const docPath = resolve(strategyDir, strategyDoc.fileName);

			expect(existsSync(docPath)).toBe(true);

			const doc = readFileSync(docPath, 'utf8');

			expect(doc.startsWith('---\n')).toBe(true);
			expect(doc).toContain('type: analysis');
			expect(doc).toContain(`title: ${strategyDoc.title}`);

			for (const section of requiredSections) {
				expect(doc).toContain(section);
			}

			for (const phrase of strategyDoc.requiredPhrases) {
				expect(doc).toContain(phrase);
			}
		}
	});
});
