import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const featureResearchDir = resolve(workspaceRoot, 'docs/research/features');

const requiredSections = [
	'## Source References',
	'## In-Product Labels To Preserve',
	'## One-Sentence Takeaway',
	'## Value Proposition',
	'## Technical Description',
	'## Before Workflow',
	'## After Workflow',
	'## Primary Pain Solved',
	'## Who Benefits Most',
	'## Transformation Shown On Screen',
	'## Capture-Critical UI States',
	'## Source-of-Truth Notes',
];

const featureDocs = [
	{
		fileName: 'symphony-feature-research.md',
		title: 'Symphony Feature Research',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[project-sources]]',
			'`Maestro Symphony`',
			'`Start Symphony`',
			'`Create Symphony Agent`',
			'`Create Agent`',
			'empty commit',
		],
	},
	{
		fileName: 'director-notes-feature-research.md',
		title: "Director's Notes Feature Research",
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[project-sources]]',
			"`Director's Notes`",
			'`Unified History`',
			'`AI Overview`',
			'`Help`',
		],
	},
	{
		fileName: 'worktree-spin-offs-feature-research.md',
		title: 'Worktree Spin-offs Feature Research',
		requiredPhrases: [
			'[[master-production-plan]]',
			'[[project-sources]]',
			'`Run in Worktree`',
			'`Dispatch to a separate worktree`',
			'`Create New Worktree`',
			'`Automatically create PR when complete`',
		],
	},
] as const;

describe('feature research artifacts', () => {
	it('creates one structured research note per planned feature video', () => {
		for (const featureDoc of featureDocs) {
			const docPath = resolve(featureResearchDir, featureDoc.fileName);

			expect(existsSync(docPath)).toBe(true);

			const doc = readFileSync(docPath, 'utf8');

			expect(doc.startsWith('---\n')).toBe(true);
			expect(doc).toContain('type: research');
			expect(doc).toContain(`title: ${featureDoc.title}`);

			for (const section of requiredSections) {
				expect(doc).toContain(section);
			}

			for (const phrase of featureDoc.requiredPhrases) {
				expect(doc).toContain(phrase);
			}
		}
	});
});
